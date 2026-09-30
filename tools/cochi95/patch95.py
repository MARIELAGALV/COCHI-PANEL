from pathlib import Path
import re
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "work95/src")

# Version + FFmpeg dependency
gradle = root / "client/build.gradle"
p = gradle.read_text()
p = p.replace("versionCode 141", "versionCode 149")
p = p.replace("versionName '0.23.87'", "versionName '0.23.95'")
motor_dep = "implementation files('libs/motorprivado-release.aar')"
ff_dep = "implementation files('libs/lib-decoder-ffmpeg-release.aar')"
assert motor_dep in p
if ff_dep not in p:
    p = p.replace(motor_dep, motor_dep + "\n    // 0.23.95 TEST: FFmpeg solo como respaldo de audio.\n    " + ff_dep)
gradle.write_text(p)

# Player: conservar DVR +/-5 min + FFmpeg después de MediaCodec.
player = root / "client/src/main/java/com/cochi/client/PlayerActivity.java"
p = player.read_text()
p = p.replace("private static final long LARGE_SEEK_INCREMENT_MS = 15L * 60L * 1000L;",
              "private static final long LARGE_SEEK_INCREMENT_MS = 5L * 60L * 1000L;")
p = p.replace("mueve 15 min", "mueve 5 min")
p = p.replace("15 minutos", "5 minutos")
p = p.replace("−15 min", "−5 min").replace("+15 min", "+5 min")

load_import = "import androidx.media3.exoplayer.DefaultLoadControl;"
renderer_import = "import androidx.media3.exoplayer.DefaultRenderersFactory;"
assert load_import in p
if renderer_import not in p:
    p = p.replace(load_import, load_import + "\n" + renderer_import)

pattern = re.compile(
    r"return\s+new\s+ExoPlayer\.Builder\(this\)\s*"
    r"\.setMediaSourceFactory\(mediaSourceFactory\)\s*"
    r"\.setLoadControl\(loadControl\)\s*"
    r"\.setSeekBackIncrementMs\(SEEK_INCREMENT_MS\)\s*"
    r"\.setSeekForwardIncrementMs\(SEEK_INCREMENT_MS\)\s*"
    r"\.build\(\);"
)
new_builder = """DefaultRenderersFactory renderersFactory = new DefaultRenderersFactory(this)
                .setEnableDecoderFallback(true)
                .setExtensionRendererMode(DefaultRenderersFactory.EXTENSION_RENDERER_MODE_ON);

        return new ExoPlayer.Builder(this, renderersFactory)
                .setMediaSourceFactory(mediaSourceFactory)
                .setLoadControl(loadControl)
                .setSeekBackIncrementMs(SEEK_INCREMENT_MS)
                .setSeekForwardIncrementMs(SEEK_INCREMENT_MS)
                .build();"""
p, count = pattern.subn(new_builder, p, count=1)
assert count == 1, "No se encontró buildStablePlayer esperado"

# EPG dentro del overlay del reproductor.
assert p.count("    private TextView channelName;") == 1
p = p.replace("    private TextView channelName;",
              "    private TextView channelName;\n    private TextView channelProgram;", 1)
assert p.count("        channelName = findViewById(R.id.channelName);") == 1
p = p.replace("        channelName = findViewById(R.id.channelName);",
              "        channelName = findViewById(R.id.channelName);\n        channelProgram = findViewById(R.id.channelProgram);", 1)
old_info = """        channelNumber.setText(String.format(Locale.US, "%03d", channel.number));
        channelName.setText(channel.name);
        channelInfo.setVisibility(View.VISIBLE);"""
new_info = """        channelNumber.setText(String.format(Locale.US, "%03d", channel.number));
        channelName.setText(channel.name);
        if (channelProgram != null) {
            String program = channel.description == null ? "" : channel.description.trim();
            channelProgram.setText(program);
            channelProgram.setVisibility(program.isEmpty() ? View.GONE : View.VISIBLE);
        }
        channelInfo.setVisibility(View.VISIBLE);"""
assert p.count(old_info) == 1, "No se encontró showChannelInfo"
p = p.replace(old_info, new_info, 1)
player.write_text(p)

# Mantener 3 capítulos por fila en TV.
series = root / "client/src/main/java/com/cochi/client/SeriesDetailActivity.java"
p = series.read_text()
assert "new GridLayoutManager(this, 2)" in p
p = p.replace("new GridLayoutManager(this, 2)", "new GridLayoutManager(this, 3)")
series.write_text(p)

# Parser EPG: el backend entrega description + epg_current/epg_next.
catalog = root / "client/src/main/java/com/cochi/client/CatalogRepository.java"
p = catalog.read_text()
old_desc = """            String description = firstNonEmpty(
                    item.optString("description", ""),
                    item.optString("descripcion", ""));"""
assert p.count(old_desc) == 1
p = p.replace(old_desc, old_desc + "\n            description = epgDescriptionFor(item, description);", 1)
helper_anchor = "    private static void collectStringArray(JSONArray array, List<String> out) {"
helper = """    private static String epgDescriptionFor(JSONObject item, String fallback) {
        String base = fallback == null ? "" : fallback.trim();
        if (item == null) return base;
        JSONObject current = item.optJSONObject("epg_current");
        JSONObject next = item.optJSONObject("epg_next");
        String currentTitle = current == null ? "" : current.optString("title", "").trim();
        String nextTitle = next == null ? "" : next.optString("title", "").trim();
        StringBuilder out = new StringBuilder();
        if (!base.isEmpty()) out.append(base);
        else if (!currentTitle.isEmpty()) out.append("Ahora: ").append(currentTitle);
        if (!nextTitle.isEmpty()) {
            if (out.length() > 0) out.append('\\n');
            out.append("Sigue: ").append(nextTitle);
        }
        return out.toString();
    }

"""
assert helper_anchor in p
p = p.replace(helper_anchor, helper + helper_anchor, 1)
catalog.write_text(p)

# Tarjetas de TV: mostrar description/EPG en celular y TV.
adapter = root / "client/src/main/java/com/cochi/client/ChannelListAdapter.java"
p = adapter.read_text()
assert "cardHeight = television ? 98 : 82;" in p
p = p.replace("cardHeight = television ? 98 : 82;", "cardHeight = television ? 120 : 112;", 1)
old_tv_desc = """        TextView description = null;
        if (!tv) {
            description = new TextView(context);
            description.setTextColor(ManagedTheme.color(context, R.color.cochi_muted));
            description.setTextSize(13f);
            description.setMaxLines(2);
            textColumn.addView(description);
        }"""
new_tv_desc = """        TextView description = new TextView(context);
        description.setTextColor(ManagedTheme.color(context, tv ? R.color.cochi_accent_2 : R.color.cochi_muted));
        description.setTextSize(tv ? (television ? 11.5f : 12f) : 13f);
        description.setMaxLines(2);
        description.setLineSpacing(0f, 1.05f);
        description.setVisibility(View.GONE);
        textColumn.addView(description);"""
assert p.count(old_tv_desc) == 1
p = p.replace(old_tv_desc, new_tv_desc, 1)
old_bind = """        } else {
            holder.category.setText(safeCategory(item.category));
            if (holder.description != null) {
                holder.description.setText(item.description);
                holder.description.setVisibility(item.description == null || item.description.isEmpty()
                        ? View.GONE : View.VISIBLE);
            }
        }"""
new_bind = """        } else {
            holder.category.setText(safeCategory(item.category));
        }
        if (holder.description != null) {
            holder.description.setText(item.description);
            holder.description.setVisibility(item.description == null || item.description.isEmpty()
                    ? View.GONE : View.VISIBLE);
        }"""
assert p.count(old_bind) == 1
p = p.replace(old_bind, new_bind, 1)
adapter.write_text(p)

# Overlay del reproductor: canal + programa actual/siguiente.
layout = root / "client/src/main/res/layout/activity_player.xml"
p = layout.read_text()
old_name = """        <TextView
            android:id="@+id/channelName"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="14dp"
            android:text="Canal"
            android:textColor="@color/cochi_text"
            android:textSize="19sp"
            android:textStyle="bold" />"""
new_name = """        <LinearLayout
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="14dp"
            android:orientation="vertical">

            <TextView
                android:id="@+id/channelName"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Canal"
                android:textColor="@color/cochi_text"
                android:textSize="19sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/channelProgram"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="3dp"
                android:maxLines="2"
                android:textColor="@color/cochi_accent_2"
                android:textSize="13sp"
                android:visibility="gone" />
        </LinearLayout>"""
assert p.count(old_name) == 1
p = p.replace(old_name, new_name, 1)
layout.write_text(p)

# R8: conservar extensión FFmpeg cargada por reflexión.
rules = root / "client/proguard-rules.pro"
p = rules.read_text()
keep = """
# v0.23.95 TEST - Media3 FFmpeg audio extension.
-keep class androidx.media3.decoder.ffmpeg.** { *; }
"""
if "androidx.media3.decoder.ffmpeg.**" not in p:
    p += "\n" + keep
rules.write_text(p)
