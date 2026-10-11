package com.cochi.client;

import android.app.UiModeManager;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Typeface;
import android.os.Bundle;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONObject;
import x.AbstractC1070nF;
import x.AbstractC1116o9;
import x.C1215q4;
import x.D8;
import x.Lx;
import x.Mx;
import x.Nx;
import x.S6;
import x.ViewOnClickListenerC1686z8;
import x.W1;

/* loaded from: classes.dex */
public final class PlaybackOptionsActivity extends W1 {
    public static final /* synthetic */ int F = 0;
    public boolean E;

    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) {
        ArrayList arrayList;
        super.onCreate(bundle);
        if (!AbstractC1070nF.K(this)) {
            finish();
            return;
        }
        UiModeManager uiModeManager = (UiModeManager) getSystemService("uimode");
        this.E = (uiModeManager != null && uiModeManager.getCurrentModeType() == 4) || getPackageManager().hasSystemFeature("android.software.leanback");
        List list = Mx.a;
        synchronized (Mx.class) {
            arrayList = new ArrayList(Mx.a);
        }
        if (arrayList.isEmpty()) {
            Toast.makeText(this, "No hay opciones de reproducción", 0).show();
            finish();
        } else {
            r(arrayList);
            S6.a(this);
        }
    }

    public final void r(ArrayList arrayList) {
        String str;
        String str2;
        String str3;
        LinearLayout linearLayout = new LinearLayout(this);
        int i = 1;
        linearLayout.setOrientation(1);
        int iS = s(this.E ? 34 : 18);
        int iS2 = s(this.E ? 24 : 14);
        int iS3 = s(18);
        linearLayout.setPadding(iS, iS2, iS, iS3);
        if (!this.E) {
            linearLayout.setOnApplyWindowInsetsListener(new Nx(iS, iS2, iS3, 0));
            linearLayout.requestApplyInsets();
        }
        linearLayout.setBackgroundResource(this.E ? R.drawable.cochi_tv_dark_background : R.drawable.cochi_neon_background);
        setContentView(linearLayout);
        LinearLayout linearLayout2 = new LinearLayout(this);
        boolean z = false;
        linearLayout2.setOrientation(0);
        linearLayout2.setGravity(16);
        linearLayout.addView(linearLayout2, new LinearLayout.LayoutParams(-1, -2));
        MaterialButton materialButton = new MaterialButton(this, null);
        materialButton.setText("Atrás");
        materialButton.setAllCaps(false);
        materialButton.setOnClickListener(new D8(6, this));
        materialButton.setTextColor(S6.i(this, R.color.cochi_text));
        materialButton.setStrokeColor(ColorStateList.valueOf(S6.i(this, R.color.cochi_accent)));
        materialButton.setStrokeWidth(s(1));
        materialButton.setBackgroundTintList(ColorStateList.valueOf(S6.g(this)));
        linearLayout2.addView(materialButton, new LinearLayout.LayoutParams(s(this.E ? 130 : 104), s(this.E ? 50 : 46)));
        TextView textView = new TextView(this);
        textView.setText("OPCIONES DE REPRODUCCIÓN");
        Typeface typeface = Typeface.DEFAULT;
        textView.setTypeface(typeface, 1);
        textView.setTextColor(S6.i(this, R.color.cochi_text));
        textView.setTextSize(this.E ? 24.0f : 19.0f);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(0, -2, 1.0f);
        layoutParams.setMarginStart(s(14));
        linearLayout2.addView(textView, layoutParams);
        TextView textView2 = new TextView(this);
        textView2.setText(Mx.a());
        textView2.setTextColor(S6.i(this, R.color.cochi_text));
        textView2.setTextSize(this.E ? 28.0f : 23.0f);
        textView2.setTypeface(typeface, 1);
        LinearLayout.LayoutParams layoutParams2 = new LinearLayout.LayoutParams(-1, -2);
        layoutParams2.topMargin = s(18);
        linearLayout.addView(textView2, layoutParams2);
        TextView textView3 = new TextView(this);
        synchronized (Mx.class) {
            str = Mx.c;
        }
        textView3.setText(str);
        textView3.setTextColor(S6.i(this, R.color.cochi_accent_2));
        textView3.setTextSize(14.0f);
        linearLayout.addView(textView3, new LinearLayout.LayoutParams(-1, -2));
        TextView textView4 = new TextView(this);
        textView4.setText("Elegí un servidor. CO-CHI reproduce directamente sin abrir páginas externas.");
        textView4.setTextColor(S6.i(this, R.color.cochi_muted));
        textView4.setTextSize(13.0f);
        LinearLayout.LayoutParams layoutParams3 = new LinearLayout.LayoutParams(-1, -2);
        layoutParams3.topMargin = s(8);
        linearLayout.addView(textView4, layoutParams3);
        ScrollView scrollView = new ScrollView(this);
        LinearLayout.LayoutParams layoutParams4 = new LinearLayout.LayoutParams(-1, 0, 1.0f);
        layoutParams4.topMargin = s(14);
        linearLayout.addView(scrollView, layoutParams4);
        LinearLayout linearLayout3 = new LinearLayout(this);
        linearLayout3.setOrientation(1);
        scrollView.addView(linearLayout3);
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        int size = arrayList.size();
        int i2 = 0;
        while (i2 < size) {
            Object obj = arrayList.get(i2);
            i2++;
            Lx lx = (Lx) obj;
            if (lx != null && !lx.e.isEmpty()) {
                ((List) linkedHashMap.computeIfAbsent(lx.a.toLowerCase() + "|" + lx.b.toLowerCase() + "|" + lx.c.toLowerCase(), new C1215q4(5))).add(lx);
            }
        }
        Iterator it = linkedHashMap.entrySet().iterator();
        boolean z2 = true;
        while (it.hasNext()) {
            List list = (List) ((Map.Entry) it.next()).getValue();
            if (!list.isEmpty()) {
                Lx lx2 = (Lx) list.get(z ? 1 : 0);
                MaterialCardView materialCardView = new MaterialCardView(this, null);
                materialCardView.setCardBackgroundColor(S6.g(this));
                materialCardView.setStrokeColor(S6.i(this, R.color.cochi_tv_border_soft));
                materialCardView.setStrokeWidth(s(i));
                materialCardView.setRadius(s(14));
                LinearLayout.LayoutParams layoutParams5 = new LinearLayout.LayoutParams(-1, -2);
                layoutParams5.bottomMargin = s(10);
                linearLayout3.addView(materialCardView, layoutParams5);
                MaterialButton materialButton2 = new MaterialButton(this, null);
                if (list.size() == i) {
                    str2 = "1 opción";
                } else {
                    str2 = list.size() + " opciones";
                }
                Iterator it2 = list.iterator();
                while (true) {
                    if (!it2.hasNext()) {
                        str3 = "";
                        break;
                    }
                    Lx lx3 = (Lx) it2.next();
                    if (lx3 != null) {
                        str3 = lx3.d;
                        if (!str3.isEmpty()) {
                            break;
                        }
                    }
                }
                StringBuilder sb = new StringBuilder();
                sb.append(lx2.a());
                sb.append("\n");
                sb.append(str2);
                sb.append(str3.isEmpty() ? "" : " · ".concat(str3));
                materialButton2.setText(sb.toString());
                materialButton2.setAllCaps(z);
                materialButton2.setGravity(8388627);
                materialButton2.setTextSize(this.E ? 17.0f : 15.0f);
                materialButton2.setTextColor(S6.i(this, R.color.cochi_text));
                materialButton2.setBackgroundTintList(getColorStateList(android.R.color.transparent));
                materialButton2.setPadding(s(18), s(12), s(18), s(12));
                materialButton2.setMinHeight(s(this.E ? 72 : 64));
                materialButton2.setOnClickListener(new ViewOnClickListenerC1686z8(this, 4, list));
                materialCardView.addView(materialButton2, new FrameLayout.LayoutParams(-1, -2));
                if (z2 && this.E) {
                    materialButton2.requestFocus();
                    z2 = false;
                }
                i = 1;
                z = false;
            }
        }
    }

    public final int s(int i) {
        return Math.round(i * getResources().getDisplayMetrics().density);
    }

    public final void t(Lx lx) {
        int i;
        if (lx != null) {
            String str = lx.e;
            int i2 = lx.j;
            if (str.isEmpty()) {
                return;
            }
            Intent intent = new Intent(this, (Class<?>) PlayerActivity.class);
            if (i2 < 0 || (i = lx.k) < 0 || !AbstractC1116o9.b(i2, i)) {
                intent.putExtra("cochi.extra.URL", str);
                intent.putExtra("cochi.extra.STREAM_TYPE", lx.f);
                JSONObject jSONObject = new JSONObject();
                try {
                    for (Map.Entry entry : lx.g.entrySet()) {
                        jSONObject.put((String) entry.getKey(), entry.getValue());
                    }
                } catch (Exception unused) {
                }
                intent.putExtra("cochi.extra.HEADERS_JSON", jSONObject.toString());
                intent.putExtra("cochi.extra.CLEARKEY_MULTI", lx.h);
                intent.putExtra("cochi.extra.DISPLAY_NAME", Mx.a());
            } else {
                intent.putExtra("cochi.extra.STORE_ITEM", true);
                intent.putExtra("cochi.extra.CHANNEL_INDEX", i2);
                intent.putExtra("cochi.extra.CATALOG_SOURCE", "MOVIES");
            }
            startActivity(intent);
        }
    }
}
