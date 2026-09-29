package com.cochi.client;

import android.app.UiModeManager;
import android.content.res.ColorStateList;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.button.MaterialButton;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import x.A8;
import x.AbstractC0966lF;
import x.AbstractC1116o9;
import x.AbstractC1259qx;
import x.B8;
import x.C0802i5;
import x.C0806i9;
import x.C1012m9;
import x.C1634y8;
import x.C8;
import x.D8;
import x.E8;
import x.F8;
import x.G8;
import x.O8;
import x.P8;
import x.S6;
import x.ViewOnClickListenerC1686z8;
import x.W1;

/* loaded from: classes.dex */
public class CatalogActivity extends W1 {
    public static final /* synthetic */ int Q = 0;
    public RecyclerView E;
    public C1012m9 G;
    public LinearLayout H;
    public ProgressBar I;
    public TextView J;
    public EditText K;
    public int F = 1;
    public P8 L = P8.j;
    public ArrayList M = new ArrayList();
    public String N = "Todos";
    public String O = "";
    public boolean P = true;

    public static void r(CatalogActivity catalogActivity) {
        ArrayList arrayList;
        catalogActivity.H.removeAllViews();
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        linkedHashMap.put("todos", "Todos");
        if (catalogActivity.L != P8.k || AbstractC0966lF.d()) {
            ArrayList arrayList2 = catalogActivity.M;
            int size = arrayList2.size();
            int i = 0;
            while (i < size) {
                Object obj = arrayList2.get(i);
                i++;
                C0806i9 c0806i9 = (C0806i9) obj;
                if (c0806i9 != null) {
                    String strZ = z(c0806i9.j);
                    linkedHashMap.putIfAbsent(strZ.toLowerCase(Locale.ROOT), strZ);
                }
            }
        } else {
            synchronized (AbstractC0966lF.class) {
                arrayList = new ArrayList(AbstractC0966lF.b.values());
            }
            int size2 = arrayList.size();
            int i2 = 0;
            while (i2 < size2) {
                Object obj2 = arrayList.get(i2);
                i2++;
                String str = (String) obj2;
                if (str != null && !str.trim().isEmpty()) {
                    linkedHashMap.putIfAbsent(str.toLowerCase(Locale.ROOT), str);
                }
            }
        }
        for (String str2 : linkedHashMap.values()) {
            MaterialButton materialButton = new MaterialButton(catalogActivity, null);
            materialButton.setText(str2);
            materialButton.setAllCaps(false);
            materialButton.setFocusable(true);
            boolean zW = catalogActivity.w();
            materialButton.setMinHeight(catalogActivity.u(zW ? 46 : 44));
            materialButton.setCornerRadius(catalogActivity.u(zW ? 12 : 22));
            materialButton.setTextSize(14.0f);
            materialButton.setTag(str2);
            materialButton.setOnClickListener(new ViewOnClickListenerC1686z8(catalogActivity, 0, str2));
            materialButton.setOnFocusChangeListener(new A8(catalogActivity, zW, materialButton, 0));
            LinearLayout linearLayout = catalogActivity.H;
            boolean z = linearLayout != null && linearLayout.getOrientation() == 1;
            if (z) {
                materialButton.setGravity(8388627);
                materialButton.setPadding(catalogActivity.u(18), 0, catalogActivity.u(14), 0);
                materialButton.setOnKeyListener(new B8(0, catalogActivity));
            }
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(z ? -1 : -2, catalogActivity.u(z ? zW ? 46 : 54 : 44));
            if (z) {
                layoutParams.setMargins(catalogActivity.u(2), 0, catalogActivity.u(2), catalogActivity.u(zW ? 6 : 10));
            } else {
                layoutParams.setMarginEnd(catalogActivity.u(8));
            }
            materialButton.setLayoutParams(layoutParams);
            if (z && catalogActivity.H.getChildCount() == 0) {
                int iGenerateViewId = View.generateViewId();
                materialButton.setId(iGenerateViewId);
                catalogActivity.K.setNextFocusDownId(iGenerateViewId);
                materialButton.setNextFocusUpId(R.id.searchInput);
            }
            catalogActivity.H.addView(materialButton);
        }
        catalogActivity.A();
        if (!catalogActivity.w() || catalogActivity.H.getChildCount() <= 0) {
            return;
        }
        View childAt = catalogActivity.H.getChildAt(0);
        Objects.requireNonNull(childAt);
        childAt.post(new C8(childAt, 0));
    }

    public static void s(CatalogActivity catalogActivity, String str) {
        if (catalogActivity.L == P8.k) {
            catalogActivity.M = new ArrayList();
            O8.h(catalogActivity);
            catalogActivity.H.removeAllViews();
            catalogActivity.G.l(new ArrayList());
        }
        catalogActivity.I.setVisibility(8);
        catalogActivity.E.setVisibility(8);
        catalogActivity.J.setText(str);
        catalogActivity.J.setVisibility(0);
        catalogActivity.J.setClickable(true);
        catalogActivity.J.setFocusable(true);
        catalogActivity.J.setOnClickListener(new D8(0, catalogActivity));
    }

    public static String z(String str) {
        return (str == null || str.trim().isEmpty()) ? "General" : str.trim();
    }

    public final void A() {
        for (int i = 0; i < this.H.getChildCount(); i++) {
            View childAt = this.H.getChildAt(i);
            if (childAt instanceof MaterialButton) {
                MaterialButton materialButton = (MaterialButton) childAt;
                t(materialButton, z(this.N).equalsIgnoreCase(z(String.valueOf(materialButton.getTag()))), materialButton.hasFocus());
            }
        }
    }

    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_catalog);
        S6.a(this);
        if (w()) {
            int iC = S6.c(this);
            getWindow().setStatusBarColor(iC);
            getWindow().setNavigationBarColor(iC);
            getWindow().getDecorView().setBackgroundColor(iC);
        }
        String stringExtra = getIntent().getStringExtra("cochi.extra.CATALOG_SOURCE");
        if (stringExtra != null) {
            try {
                this.L = P8.valueOf(stringExtra);
            } catch (Exception unused) {
            }
        }
        this.E = (RecyclerView) findViewById(R.id.itemRecycler);
        this.H = (LinearLayout) findViewById(R.id.categoryRow);
        this.I = (ProgressBar) findViewById(R.id.catalogLoading);
        this.J = (TextView) findViewById(R.id.emptyText);
        this.K = (EditText) findViewById(R.id.searchInput);
        int i = w() ? 4 : 1;
        this.F = i;
        this.E.setLayoutManager(i > 1 ? new GridLayoutManager(this.F) : new LinearLayoutManager(1));
        this.E.setHasFixedSize(true);
        if (w()) {
            this.E.setItemAnimator(null);
        }
        this.E.setItemViewCacheSize(10);
        C1012m9 c1012m9 = new C1012m9(this, 2, new C0802i5(1, this));
        this.G = c1012m9;
        this.E.setAdapter(c1012m9);
        int i2 = 0;
        this.K.addTextChangedListener(new E8(this, i2));
        this.K.setOnEditorActionListener(new C1634y8(this, i2));
        RecyclerView recyclerView = this.E;
        F8 f8 = new F8(this, i2);
        if (recyclerView.H == null) {
            recyclerView.H = new ArrayList();
        }
        recyclerView.H.add(f8);
        TextView textView = (TextView) findViewById(R.id.catalogTitle);
        TextView textView2 = (TextView) findViewById(R.id.catalogSubtitle);
        textView.setText(this.L == P8.k ? "SERIES" : "PELÍCULAS");
        textView2.setText("Elegí una categoría o explorá todo");
        x();
    }

    @Override // x.W1, android.app.Activity
    public final void onResume() {
        super.onResume();
        if (this.L == P8.k) {
            if (this.P) {
                this.P = false;
            } else {
                x();
            }
        }
    }

    public final void t(MaterialButton materialButton, boolean z, boolean z2) {
        boolean zW = w();
        materialButton.setBackgroundTintList(ColorStateList.valueOf(z ? S6.J(this) : S6.g(this)));
        materialButton.setTextColor(S6.P(this));
        materialButton.setStrokeColor(ColorStateList.valueOf((z2 || z) ? S6.A(this) : S6.d(this)));
        materialButton.setStrokeWidth(u(z2 ? 3 : (!z && zW) ? 1 : 2));
    }

    public final int u(int i) {
        return Math.round(i * getResources().getDisplayMetrics().density);
    }

    public final ArrayList v() {
        ArrayList arrayList = new ArrayList();
        String str = this.O;
        String lowerCase = str == null ? "" : str.trim().toLowerCase(Locale.ROOT);
        ArrayList arrayList2 = this.M;
        int size = arrayList2.size();
        int i = 0;
        while (i < size) {
            Object obj = arrayList2.get(i);
            i++;
            C0806i9 c0806i9 = (C0806i9) obj;
            if (c0806i9 != null) {
                if (lowerCase.isEmpty()) {
                    if (this.L == P8.k) {
                        String str2 = c0806i9.a;
                        String str3 = this.N;
                        Map map = AbstractC0966lF.a;
                        synchronized (AbstractC0966lF.class) {
                            if (str3 != null) {
                                if (!str3.trim().isEmpty() && !"Todos".equalsIgnoreCase(str3.trim())) {
                                    Set<String> set = (Set) AbstractC0966lF.c.get(str2);
                                    if (set != null && !set.isEmpty()) {
                                        for (String str4 : set) {
                                            String str5 = (String) AbstractC0966lF.b.get(str4);
                                            if (str3.equalsIgnoreCase(str4) || (str5 != null && str3.equalsIgnoreCase(str5))) {
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else if (!"Todos".equalsIgnoreCase(this.N)) {
                        if (z(this.N).equalsIgnoreCase(z(c0806i9.j))) {
                        }
                    }
                }
                String str6 = c0806i9.c;
                String lowerCase2 = str6 == null ? "" : str6.toLowerCase(Locale.ROOT);
                if (lowerCase.isEmpty() || lowerCase2.contains(lowerCase)) {
                    arrayList.add(c0806i9);
                }
            }
        }
        return arrayList;
    }

    public final boolean w() {
        UiModeManager uiModeManager = (UiModeManager) getSystemService("uimode");
        return (uiModeManager != null && uiModeManager.getCurrentModeType() == 4) || getPackageManager().hasSystemFeature("android.software.leanback");
    }

    public final void x() {
        this.I.setVisibility(0);
        this.J.setVisibility(8);
        this.G.l(new ArrayList());
        this.H.removeAllViews();
        O8.x(this, this.L, new G8(0, this));
    }

    public final void y() {
        String str;
        ArrayList arrayListV = v();
        AbstractC1116o9.c(arrayListV);
        if (!arrayListV.isEmpty()) {
            this.J.setVisibility(8);
            this.E.setVisibility(0);
            this.G.l(arrayListV);
            this.E.g0(0);
            AbstractC1259qx.z(this, arrayListV, w() ? 8 : 14);
            return;
        }
        this.G.l(arrayListV);
        TextView textView = this.J;
        String str2 = this.O;
        if (str2 == null || str2.trim().isEmpty()) {
            str = "No hay contenido en esta categoría.";
        } else {
            str = "No se encontraron resultados para \"" + this.O.trim() + "\".";
        }
        textView.setText(str);
        this.J.setVisibility(0);
        this.E.setVisibility(8);
    }
}
