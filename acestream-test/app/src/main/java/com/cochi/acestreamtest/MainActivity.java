package com.cochi.acestreamtest;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final String TEST_ID = "f16d68fa5ff64f3894a45062ca28e4e66f142c6a";
    private static final String ACTION_START_CONTENT = "org.acestream.action.start_content";
    private static final String[] ACE_PACKAGES = {\n            "org.acestream.node",
            "org.acestream.media",
            "org.acestream.media.atv",
            "org.acestream.core",
            "org.acestream.core.atv"
    };

    private EditText input;
    private TextView status;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setPadding(dp(22), dp(34), dp(22), dp(24));
        root.setBackgroundColor(Color.rgb(4, 11, 24));

        TextView title = new TextView(this);
        title.setText("CO-CHI\nACE STREAM TEST v3");
        title.setTextColor(Color.rgb(0, 225, 255));
        title.setTextSize(28);
        title.setGravity(Gravity.CENTER);
        title.setTypeface(null, 1);
        root.addView(title, lp(-1, -2, 0, 0, 0, 18));

        TextView info = new TextView(this);
        info.setText("Prueba actualizada para la app oficial 2026 (org.acestream.node) y paquetes anteriores. No cambia el reproductor de CO-CHI.");
        info.setTextColor(Color.WHITE);
        info.setTextSize(15);
        info.setGravity(Gravity.CENTER);
        root.addView(info, lp(-1, -2, 0, 0, 0, 18));

        input = new EditText(this);
        input.setSingleLine(false);
        input.setText("acestream://" + TEST_ID);
        input.setTextColor(Color.WHITE);
        input.setHintTextColor(Color.GRAY);
        input.setHint("acestream://CONTENT_ID");
        input.setBackgroundColor(Color.rgb(13, 28, 50));
        input.setPadding(dp(12), dp(12), dp(12), dp(12));
        root.addView(input, lp(-1, -2, 0, 0, 0, 14));

        Button test = new Button(this);
        test.setText("ABRIR ACE STREAM");
        test.setTextSize(16);
        test.setAllCaps(false);
        test.setOnClickListener(v -> openAceStream());
        root.addView(test, lp(-1, dp(56), 0, 0, 0, 14));

        Button reset = new Button(this);
        reset.setText("CARGAR DAZN F1 DE PRUEBA");
        reset.setTextSize(14);
        reset.setAllCaps(false);
        reset.setOnClickListener(v -> {
            input.setText("acestream://" + TEST_ID);
            status.setText("ID de prueba cargado. Tocá ABRIR ACE STREAM.");
        });
        root.addView(reset, lp(-1, dp(52), 0, 0, 0, 18));

        status = new TextView(this);
        status.setText("Esperando prueba.");
        status.setTextColor(Color.rgb(180, 220, 235));
        status.setTextSize(14);
        status.setGravity(Gravity.CENTER);
        root.addView(status, lp(-1, -2, 0, 0, 0, 0));

        setContentView(root);
    }

    private void openAceStream() {
        String value = input.getText() == null ? "" : input.getText().toString().trim();
        if (value.isEmpty()) {
            status.setText("Pegá un Content ID o una URL acestream://.");
            return;
        }

        String contentId = value;
        if (contentId.startsWith("acestream://")) {
            contentId = contentId.substring("acestream://".length());
        } else if (contentId.startsWith("acestream:?content_id=")) {
            contentId = contentId.substring("acestream:?content_id=".length());
        }
        contentId = contentId.trim();
        if (contentId.isEmpty()) {
            status.setText("Content ID vacío.");
            return;
        }

        // Método actual recomendado por Ace Stream 3.1.43.0+
        Intent modern = new Intent(ACTION_START_CONTENT);
        modern.setData(Uri.parse("acestream:?content_id=" + Uri.encode(contentId)));

        try {
            if (modern.resolveActivity(getPackageManager()) != null) {
                status.setText("Ace Stream detectado. Abriendo con integración actual…");
                startActivity(modern);
                return;
            }
        } catch (Exception ignored) {}

        // Compatibilidad con versiones antiguas o implementaciones que exponen VIEW.
        Intent legacy = new Intent(Intent.ACTION_VIEW, Uri.parse("acestream://" + contentId));
        try {
            if (legacy.resolveActivity(getPackageManager()) != null) {
                status.setText("Ace Stream detectado. Abriendo con compatibilidad legacy…");
                startActivity(legacy);
                return;
            }
        } catch (Exception ignored) {}

        // Distingue entre "instalado pero sin resolver el intent" y "no instalado".
        boolean installed = false;
        for (String pkg : ACE_PACKAGES) {
            try {
                getPackageManager().getPackageInfo(pkg, 0);
                installed = true;
                break;
            } catch (Exception ignored) {}
        }

        if (installed) {
            status.setText("Ace Stream parece estar instalado, pero esta versión no expone el método de apertura esperado.");
            Toast.makeText(this, "Ace Stream está instalado pero no respondió al intent", Toast.LENGTH_LONG).show();
        } else {
            status.setText("No encontré Ace Stream instalado. Instalá Ace Stream Media o Ace Stream Engine y volvé a probar.");
            Toast.makeText(this, "Ace Stream no está instalado en este dispositivo", Toast.LENGTH_LONG).show();
        }
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private LinearLayout.LayoutParams lp(int w, int h, int l, int t, int r, int b) {
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(w, h);
        p.setMargins(dp(l), dp(t), dp(r), dp(b));
        return p;
    }
}
