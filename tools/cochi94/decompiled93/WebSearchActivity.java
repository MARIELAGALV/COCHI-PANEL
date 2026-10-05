package com.cochi.client;

import android.app.UiModeManager;
import android.content.res.ColorStateList;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.cochi.client.WebSearchActivity;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicInteger;
import org.json.JSONArray;
import org.json.JSONObject;
import x.AbstractC0431ax;
import x.AbstractC1070nF;
import x.AbstractC1259qx;
import x.C0806i9;
import x.C1163p4;
import x.C1487vH;
import x.C1540wI;
import x.C1634y8;
import x.E8;
import x.GN;
import x.HN;
import x.Lx;
import x.Nx;
import x.RunnableC0440b5;
import x.RunnableC0517cg;
import x.S6;
import x.Uy;
import x.W1;

/* loaded from: classes.dex */
public final class WebSearchActivity extends W1 {
    public static final /* synthetic */ int S = 0;
    public final Handler E = new Handler(Looper.getMainLooper());
    public final AtomicInteger F = new AtomicInteger();
    public boolean G;
    public EditText H;
    public MaterialButton I;
    public ProgressBar J;
    public TextView K;
    public TextView L;
    public TextView M;
    public TextView N;
    public ImageView O;
    public RecyclerView P;
    public GN Q;
    public Uy R;

    public static void r(WebSearchActivity webSearchActivity, HN hn, C0806i9 c0806i9, int i) {
        ArrayList arrayList = new ArrayList();
        if (c0806i9 != null) {
            ArrayList arrayList2 = new ArrayList();
            List<C1487vH> list = c0806i9.h;
            if (list != null) {
                int i2 = 0;
                for (C1487vH c1487vH : list) {
                    if (c1487vH != null) {
                        String str = c1487vH.e;
                        if (!c1487vH.a.isEmpty()) {
                            if (str.isEmpty()) {
                                str = "CO-CHI";
                            }
                            arrayList2.add(new Lx(str, c1487vH.f, c1487vH.g, c1487vH.d, c1487vH.a, c1487vH.b, c1487vH.c, c1487vH.i.a, c1487vH.h + i2, i, i2));
                            i2++;
                        }
                    }
                }
            }
            arrayList.addAll(arrayList2);
        }
        try {
            JSONArray jSONArrayOptJSONArray = AbstractC0431ax.K(webSearchActivity.getApplicationContext(), hn).optJSONArray("options");
            if (jSONArrayOptJSONArray != null) {
                for (int i3 = 0; i3 < jSONArrayOptJSONArray.length() && arrayList.size() < 40; i3++) {
                    Lx lxV = v(jSONArrayOptJSONArray.optJSONObject(i3));
                    if (lxV != null) {
                        String str2 = lxV.e;
                        if (!str2.isEmpty() && str2 != null && !str2.trim().isEmpty()) {
                            int size = arrayList.size();
                            int i4 = 0;
                            while (true) {
                                if (i4 >= size) {
                                    arrayList.add(lxV);
                                    break;
                                }
                                Object obj = arrayList.get(i4);
                                i4++;
                                Lx lx = (Lx) obj;
                                if (lx == null || !str2.equals(lx.e)) {
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception unused) {
        }
        ArrayList arrayList3 = new ArrayList(arrayList);
        arrayList3.sort(new C1163p4(webSearchActivity));
        webSearchActivity.runOnUiThread(new RunnableC0440b5(webSearchActivity, arrayList3, hn, 10));
    }

    public static int t(Lx lx) {
        String lowerCase = lx == null ? "" : lx.b.toLowerCase(Locale.ROOT);
        String lowerCase2 = lx != null ? lx.c.toLowerCase(Locale.ROOT) : "";
        if (lowerCase.contains("latino")) {
            return 0;
        }
        if (lowerCase.contains("castellano")) {
            return 1;
        }
        if (lowerCase.contains("español")) {
            return 2;
        }
        if (lowerCase2.contains("subtítulos es")) {
            return 3;
        }
        return lowerCase.contains("sin verificar") ? 5 : 4;
    }

    public static String u(String str) {
        return str == null ? "" : Normalizer.normalize(str, Normalizer.Form.NFD).replaceAll("\\p{M}+", "").toLowerCase(Locale.ROOT).replace('&', ' ').replaceAll("[^a-z0-9]+", " ").trim().replaceAll("\\s+", " ");
    }

    public static Lx v(JSONObject jSONObject) {
        if (jSONObject == null) {
            return null;
        }
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        JSONObject jSONObjectOptJSONObject = jSONObject.optJSONObject("headers");
        if (jSONObjectOptJSONObject != null) {
            Iterator<String> itKeys = jSONObjectOptJSONObject.keys();
            while (itKeys.hasNext()) {
                String next = itKeys.next();
                String strOptString = jSONObjectOptJSONObject.optString(next, "");
                if (!next.trim().isEmpty() && !strOptString.trim().isEmpty()) {
                    linkedHashMap.put(next, strOptString);
                }
            }
        }
        return new Lx(jSONObject.optString("server", jSONObject.optString("provider", "Servidor")), jSONObject.optString("language", ""), jSONObject.optString("subtitles", ""), jSONObject.optString("quality", ""), jSONObject.optString("url", ""), jSONObject.optString("type", "auto"), linkedHashMap, jSONObject.optString("clear_key_pairs", ""), jSONObject.optInt("priority", 100), -1, -1);
    }

    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        if (!AbstractC1070nF.K(this)) {
            finish();
            return;
        }
        UiModeManager uiModeManager = (UiModeManager) getSystemService("uimode");
        this.G = (uiModeManager != null && uiModeManager.getCurrentModeType() == 4) || getPackageManager().hasSystemFeature("android.software.leanback");
        LinearLayout linearLayout = new LinearLayout(this);
        linearLayout.setOrientation(1);
        int iS = s(this.G ? 28 : 16);
        int iS2 = s(this.G ? 22 : 14);
        int iS3 = s(16);
        linearLayout.setPadding(iS, iS2, iS, iS3);
        if (!this.G) {
            linearLayout.setOnApplyWindowInsetsListener(new Nx(iS, iS2, iS3, 1));
            linearLayout.requestApplyInsets();
        }
        linearLayout.setBackgroundResource(this.G ? R.drawable.cochi_tv_dark_background : R.drawable.cochi_neon_background);
        setContentView(linearLayout);
        LinearLayout linearLayout2 = new LinearLayout(this);
        linearLayout2.setOrientation(0);
        linearLayout2.setGravity(16);
        linearLayout.addView(linearLayout2, new LinearLayout.LayoutParams(-1, -2));
        MaterialButton materialButton = new MaterialButton(this, null);
        materialButton.setText("Atrás");
        materialButton.setAllCaps(false);
        materialButton.setIconResource(R.drawable.ic_cochi_home);
        materialButton.setIconTint(ColorStateList.valueOf(S6.i(this, R.color.cochi_accent_2)));
        materialButton.setTextColor(S6.i(this, R.color.cochi_text));
        materialButton.setBackgroundTintList(ColorStateList.valueOf(S6.g(this)));
        materialButton.setStrokeColor(ColorStateList.valueOf(S6.i(this, R.color.cochi_accent)));
        materialButton.setStrokeWidth(s(1));
        materialButton.setCornerRadius(s(12));
        final int i = 0;
        materialButton.setOnClickListener(new View.OnClickListener(this) { // from class: x.EN
            public final /* synthetic */ WebSearchActivity i;

            {
                this.i = this;
            }

            @Override // android.view.View.OnClickListener
            public final void onClick(View view) {
                int i2 = i;
                WebSearchActivity webSearchActivity = this.i;
                switch (i2) {
                    case 0:
                        int i3 = WebSearchActivity.S;
                        webSearchActivity.finish();
                        break;
                    default:
                        webSearchActivity.w(webSearchActivity.H.getText().toString());
                        break;
                }
            }
        });
        linearLayout2.addView(materialButton, new LinearLayout.LayoutParams(s(this.G ? 132 : 108), s(this.G ? 50 : 48)));
        TextView textView = new TextView(this);
        textView.setText("BUSCADOR DE SERIES Y PELÍCULAS");
        textView.setTextColor(S6.i(this, R.color.cochi_text));
        textView.setTextSize(this.G ? 24.0f : 20.0f);
        Typeface typeface = Typeface.DEFAULT;
        textView.setTypeface(typeface, 1);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(0, -2, 1.0f);
        layoutParams.setMarginStart(s(16));
        linearLayout2.addView(textView, layoutParams);
        LinearLayout linearLayout3 = new LinearLayout(this);
        linearLayout3.setOrientation(0);
        linearLayout3.setGravity(16);
        LinearLayout.LayoutParams layoutParams2 = new LinearLayout.LayoutParams(-1, -2);
        layoutParams2.topMargin = s(16);
        linearLayout.addView(linearLayout3, layoutParams2);
        EditText editText = new EditText(this);
        this.H = editText;
        editText.setSingleLine(true);
        this.H.setHint("Batman, Rocky, Star Wars...");
        this.H.setHintTextColor(S6.i(this, R.color.cochi_muted));
        this.H.setTextColor(S6.i(this, R.color.cochi_text));
        this.H.setTextSize(this.G ? 18.0f : 16.0f);
        this.H.setImeOptions(3);
        this.H.setBackgroundResource(R.drawable.tv_search_selector);
        this.H.setPadding(s(16), 0, s(16), 0);
        linearLayout3.addView(this.H, new LinearLayout.LayoutParams(0, s(this.G ? 56 : 52), 1.0f));
        MaterialButton materialButton2 = new MaterialButton(this, null);
        this.I = materialButton2;
        materialButton2.setText("Buscar");
        this.I.setAllCaps(false);
        this.I.setIconResource(R.drawable.ic_cochi_search);
        this.I.setIconTint(ColorStateList.valueOf(S6.i(this, R.color.cochi_text)));
        this.I.setTextColor(S6.i(this, R.color.cochi_text));
        this.I.setBackgroundTintList(ColorStateList.valueOf(S6.i(this, R.color.cochi_blue_button)));
        this.I.setCornerRadius(s(12));
        LinearLayout.LayoutParams layoutParams3 = new LinearLayout.LayoutParams(s(this.G ? 150 : 124), s(this.G ? 56 : 52));
        layoutParams3.setMarginStart(s(10));
        linearLayout3.addView(this.I, layoutParams3);
        LinearLayout linearLayout4 = new LinearLayout(this);
        linearLayout4.setOrientation(0);
        linearLayout4.setGravity(16);
        LinearLayout.LayoutParams layoutParams4 = new LinearLayout.LayoutParams(-1, -2);
        layoutParams4.topMargin = s(10);
        linearLayout.addView(linearLayout4, layoutParams4);
        ProgressBar progressBar = new ProgressBar(this);
        this.J = progressBar;
        progressBar.setVisibility(8);
        linearLayout4.addView(this.J, new LinearLayout.LayoutParams(s(26), s(26)));
        TextView textView2 = new TextView(this);
        this.K = textView2;
        textView2.setTextColor(S6.i(this, R.color.cochi_muted));
        this.K.setTextSize(this.G ? 14.0f : 13.0f);
        LinearLayout.LayoutParams layoutParams5 = new LinearLayout.LayoutParams(0, -2, 1.0f);
        layoutParams5.setMarginStart(s(8));
        linearLayout4.addView(this.K, layoutParams5);
        LinearLayout linearLayout5 = new LinearLayout(this);
        linearLayout5.setOrientation(0);
        LinearLayout.LayoutParams layoutParams6 = new LinearLayout.LayoutParams(-1, 0, 1.0f);
        layoutParams6.topMargin = s(8);
        linearLayout.addView(linearLayout5, layoutParams6);
        RecyclerView recyclerView = new RecyclerView(this, null);
        this.P = recyclerView;
        recyclerView.setClipChildren(false);
        this.P.setClipToPadding(false);
        int i2 = 2;
        this.P.setOverScrollMode(2);
        if (this.G) {
            i2 = 5;
        } else if (getResources().getConfiguration().orientation == 2) {
            i2 = 4;
        }
        this.P.setLayoutManager(new GridLayoutManager(i2));
        GN gn = new GN(this, this.G, new C1540wI(this));
        this.Q = gn;
        this.P.setAdapter(gn);
        linearLayout5.addView(this.P, new LinearLayout.LayoutParams(0, -1, this.G ? 0.7f : 1.0f));
        if (this.G) {
            MaterialCardView materialCardView = new MaterialCardView(this, null);
            materialCardView.setCardBackgroundColor(S6.i(this, R.color.cochi_tv_surface));
            materialCardView.setRadius(s(18));
            materialCardView.setStrokeColor(S6.i(this, R.color.cochi_tv_border_soft));
            materialCardView.setStrokeWidth(s(1));
            LinearLayout linearLayout6 = new LinearLayout(this);
            linearLayout6.setOrientation(1);
            linearLayout6.setPadding(s(16), s(16), s(16), s(16));
            materialCardView.addView(linearLayout6, new FrameLayout.LayoutParams(-1, -1));
            ImageView imageView = new ImageView(this);
            this.O = imageView;
            imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
            this.O.setImageResource(R.drawable.ic_cochi);
            linearLayout6.addView(this.O, new LinearLayout.LayoutParams(-1, s(248)));
            TextView textView3 = new TextView(this);
            this.L = textView3;
            textView3.setText("Elegí un resultado");
            this.L.setTextColor(S6.i(this, R.color.cochi_text));
            this.L.setTextSize(20.0f);
            this.L.setTypeface(typeface, 1);
            LinearLayout.LayoutParams layoutParams7 = new LinearLayout.LayoutParams(-1, -2);
            layoutParams7.topMargin = s(12);
            linearLayout6.addView(this.L, layoutParams7);
            TextView textView4 = new TextView(this);
            this.M = textView4;
            textView4.setTextColor(S6.i(this, R.color.cochi_accent_2));
            this.M.setTextSize(13.0f);
            linearLayout6.addView(this.M, new LinearLayout.LayoutParams(-1, -2));
            TextView textView5 = new TextView(this);
            this.N = textView5;
            textView5.setText("Los resultados se usan para identificar el título. Al elegirlo, CO-CHI busca si ya está disponible en tu catálogo.");
            this.N.setTextColor(S6.i(this, R.color.cochi_muted));
            this.N.setTextSize(13.0f);
            this.N.setMaxLines(7);
            LinearLayout.LayoutParams layoutParams8 = new LinearLayout.LayoutParams(-1, -2);
            layoutParams8.topMargin = s(8);
            linearLayout6.addView(this.N, layoutParams8);
            LinearLayout.LayoutParams layoutParams9 = new LinearLayout.LayoutParams(0, -1, 0.3f);
            layoutParams9.setMarginStart(s(16));
            linearLayout5.addView(materialCardView, layoutParams9);
        }
        final int i3 = 1;
        this.I.setOnClickListener(new View.OnClickListener(this) { // from class: x.EN
            public final /* synthetic */ WebSearchActivity i;

            {
                this.i = this;
            }

            @Override // android.view.View.OnClickListener
            public final void onClick(View view) {
                int i22 = i3;
                WebSearchActivity webSearchActivity = this.i;
                switch (i22) {
                    case 0:
                        int i32 = WebSearchActivity.S;
                        webSearchActivity.finish();
                        break;
                    default:
                        webSearchActivity.w(webSearchActivity.H.getText().toString());
                        break;
                }
            }
        });
        this.H.setOnEditorActionListener(new C1634y8(this, i3));
        this.H.addTextChangedListener(new E8(this, i3));
        S6.a(this);
        if (this.G) {
            int i4 = S6.i(this, R.color.cochi_tv_bg);
            getWindow().setStatusBarColor(i4);
            getWindow().setNavigationBarColor(i4);
            getWindow().getDecorView().setBackgroundColor(i4);
        }
        this.K.setText("Escribí una película o serie. Ejemplo: Batman");
        this.H.requestFocus();
    }

    public final int s(int i) {
        return Math.round(i * getResources().getDisplayMetrics().density);
    }

    public final void w(String str) {
        String strTrim = str == null ? "" : str.trim();
        if (strTrim.length() < 2) {
            this.K.setText("Escribí al menos 2 letras.");
            return;
        }
        int iIncrementAndGet = this.F.incrementAndGet();
        x("Buscando “" + strTrim + "”…", true);
        new Thread(new RunnableC0517cg(this, strTrim, iIncrementAndGet, 5), "cochi-tmdb-search").start();
    }

    public final void x(String str, boolean z) {
        this.J.setVisibility(z ? 0 : 8);
        this.I.setEnabled(!z);
        if (str == null || str.isEmpty()) {
            return;
        }
        this.K.setText(str);
    }

    public final void y(HN hn) {
        if (!this.G || hn == null) {
            return;
        }
        String str = hn.g;
        String str2 = hn.e;
        TextView textView = this.L;
        if (textView == null) {
            return;
        }
        textView.setText(hn.c);
        TextView textView2 = this.M;
        StringBuilder sb = new StringBuilder();
        sb.append("tv".equalsIgnoreCase(hn.b) ? "SERIE" : "PELÍCULA");
        sb.append(str2.isEmpty() ? "" : " · ".concat(str2));
        textView2.setText(sb.toString());
        TextView textView3 = this.N;
        if (str.isEmpty()) {
            str = "Sin sinopsis disponible.";
        }
        textView3.setText(str);
        AbstractC1259qx.u(hn.f, this.O);
    }
}
