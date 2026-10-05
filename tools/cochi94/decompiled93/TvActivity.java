package com.cochi.client;

import android.app.UiModeManager;
import android.content.res.ColorStateList;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.button.MaterialButton;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import x.A8;
import x.AbstractC1116o9;
import x.AbstractC1259qx;
import x.B8;
import x.C0806i9;
import x.C1012m9;
import x.C1215q4;
import x.D8;
import x.F8;
import x.G8;
import x.HK;
import x.IK;
import x.JK;
import x.K8;
import x.O8;
import x.P8;
import x.S6;
import x.ViewOnClickListenerC1686z8;
import x.W1;
import x.ZA;

/* loaded from: classes.dex */
public class TvActivity extends W1 {
    public static final /* synthetic */ int Q = 0;
    public RecyclerView E;
    public C1012m9 G;
    public LinearLayout H;
    public ProgressBar I;
    public TextView J;
    public boolean K;
    public int F = 1;
    public P8 L = P8.h;
    public ArrayList M = new ArrayList();
    public final LinkedHashMap N = new LinkedHashMap();
    public String O = "Todos";
    public int P = -1;

    public static String A(String str) {
        return (str == null || str.trim().isEmpty()) ? "General" : str.trim();
    }

    public static void r(TvActivity tvActivity) {
        LinkedHashMap linkedHashMap = tvActivity.N;
        linkedHashMap.clear();
        linkedHashMap.put("todos", new ArrayList(tvActivity.M));
        ArrayList arrayList = tvActivity.M;
        int size = arrayList.size();
        int i = 0;
        while (i < size) {
            Object obj = arrayList.get(i);
            i++;
            C0806i9 c0806i9 = (C0806i9) obj;
            if (c0806i9 != null) {
                ((List) linkedHashMap.computeIfAbsent(A(c0806i9.j).toLowerCase(Locale.ROOT), new C1215q4(6))).add(c0806i9);
            }
        }
    }

    public static void s(TvActivity tvActivity) {
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        linkedHashMap.put("todos", "Todos");
        ArrayList arrayList = tvActivity.M;
        int size = arrayList.size();
        int i = 0;
        while (i < size) {
            Object obj = arrayList.get(i);
            i++;
            C0806i9 c0806i9 = (C0806i9) obj;
            if (c0806i9 != null) {
                String strA = A(c0806i9.j);
                linkedHashMap.putIfAbsent(strA.toLowerCase(Locale.ROOT), strA);
            }
        }
        Iterator it = linkedHashMap.values().iterator();
        while (true) {
            if (!it.hasNext()) {
                break;
            }
            String str = (String) it.next();
            MaterialButton materialButton = new MaterialButton(tvActivity, null);
            materialButton.setText(str);
            materialButton.setAllCaps(false);
            materialButton.setFocusable(true);
            boolean zX = tvActivity.x();
            materialButton.setMinHeight(tvActivity.v(zX ? 46 : 44));
            materialButton.setCornerRadius(tvActivity.v(zX ? 12 : 22));
            materialButton.setTextSize(zX ? 13.5f : 14.0f);
            materialButton.setOnClickListener(new ViewOnClickListenerC1686z8(tvActivity, 5, str));
            materialButton.setTag(str);
            materialButton.setOnFocusChangeListener(new A8(tvActivity, zX, materialButton, 2));
            LinearLayout linearLayout = tvActivity.H;
            boolean z = linearLayout != null && linearLayout.getOrientation() == 1;
            if (z) {
                materialButton.setGravity(8388627);
                materialButton.setPadding(tvActivity.v(14), 0, tvActivity.v(12), 0);
                materialButton.setOnKeyListener(new B8(3, tvActivity));
            }
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(z ? -1 : -2, tvActivity.v(z ? zX ? 46 : 54 : 44));
            if (z) {
                layoutParams.setMargins(tvActivity.v(4), 0, tvActivity.v(4), tvActivity.v(zX ? 6 : 10));
            } else {
                layoutParams.setMarginEnd(tvActivity.v(8));
            }
            materialButton.setLayoutParams(layoutParams);
            tvActivity.H.addView(materialButton);
        }
        tvActivity.B();
        if (tvActivity.x() && tvActivity.H.getChildCount() > 0 && tvActivity.P == -1) {
            tvActivity.w();
        }
    }

    public static void t(TvActivity tvActivity, String str) {
        tvActivity.I.setVisibility(8);
        tvActivity.E.setVisibility(8);
        tvActivity.J.setText(str);
        tvActivity.J.setVisibility(0);
        tvActivity.J.setClickable(true);
        tvActivity.J.setFocusable(true);
        tvActivity.J.setOnClickListener(new D8(12, tvActivity));
    }

    public final void B() {
        for (int i = 0; i < this.H.getChildCount(); i++) {
            View childAt = this.H.getChildAt(i);
            if (childAt instanceof MaterialButton) {
                MaterialButton materialButton = (MaterialButton) childAt;
                u(materialButton, A(this.O).equalsIgnoreCase(A(String.valueOf(materialButton.getTag()))), materialButton.hasFocus());
            }
        }
    }

    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_tv);
        S6.a(this);
        if (x()) {
            int iC = S6.c(this);
            getWindow().setStatusBarColor(iC);
            getWindow().setNavigationBarColor(iC);
            getWindow().getDecorView().setBackgroundColor(iC);
        }
        this.K = getIntent().getBooleanExtra("cochi.extra.ADULT_ONLY", false);
        String stringExtra = getIntent().getStringExtra("cochi.extra.SOURCE");
        if (stringExtra != null) {
            try {
                this.L = P8.valueOf(stringExtra);
            } catch (Exception unused) {
            }
        }
        if (bundle != null) {
            this.O = bundle.getString("cochi.state.TV_CATEGORY", "Todos");
            this.P = bundle.getInt("cochi.state.TV_POSITION", -1);
        }
        this.E = (RecyclerView) findViewById(R.id.channelRecycler);
        this.H = (LinearLayout) findViewById(R.id.categoryRow);
        this.I = (ProgressBar) findViewById(R.id.catalogLoading);
        this.J = (TextView) findViewById(R.id.emptyText);
        int i = x() ? 2 : 1;
        this.F = i;
        this.E.setLayoutManager(i > 1 ? new GridLayoutManager(this.F) : new LinearLayoutManager(1));
        this.E.setHasFixedSize(true);
        this.E.setItemAnimator(null);
        this.E.setItemViewCacheSize(x() ? 6 : 10);
        ZA layoutManager = this.E.getLayoutManager();
        if (layoutManager instanceof LinearLayoutManager) {
            ((LinearLayoutManager) layoutManager).C = x() ? 4 : 6;
        }
        C1012m9 c1012m9 = new C1012m9(this, 1, new IK(this));
        this.G = c1012m9;
        this.E.setAdapter(c1012m9);
        RecyclerView recyclerView = this.E;
        F8 f8 = new F8(this, 1);
        if (recyclerView.H == null) {
            recyclerView.H = new ArrayList();
        }
        recyclerView.H.add(f8);
        TextView textView = (TextView) findViewById(R.id.tvTitle);
        TextView textView2 = (TextView) findViewById(R.id.tvSubtitle);
        textView.setText(this.K ? "ADULTOS" : this.L == P8.i ? "TV 2" : "TV 1");
        textView2.setText(this.K ? "Sección protegida" : "Elegí un canal para comenzar");
        y();
    }

    @Override // x.W1, android.app.Activity
    public final void onResume() {
        C1012m9 c1012m9;
        super.onResume();
        if (this.P == -1 || (c1012m9 = this.G) == null || ((ArrayList) c1012m9.h).size() <= 0) {
            return;
        }
        int iMin = Math.min(this.P, ((ArrayList) this.G.h).size() - 1);
        this.E.g0(iMin);
        this.E.post(new HK(this, iMin, 1));
    }

    @Override // x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onSaveInstanceState(Bundle bundle) {
        bundle.putString("cochi.state.TV_CATEGORY", this.O);
        RecyclerView recyclerView = this.E;
        LinearLayoutManager linearLayoutManager = recyclerView == null ? null : (LinearLayoutManager) recyclerView.getLayoutManager();
        int i = this.P;
        if (linearLayoutManager != null) {
            int iN0 = linearLayoutManager.N0();
            if (i == -1 && iN0 != -1) {
                i = iN0;
            }
        }
        bundle.putInt("cochi.state.TV_POSITION", i);
        super.onSaveInstanceState(bundle);
    }

    public final void u(MaterialButton materialButton, boolean z, boolean z2) {
        boolean zX = x();
        materialButton.setBackgroundTintList(ColorStateList.valueOf(z ? S6.J(this) : S6.g(this)));
        materialButton.setTextColor(S6.P(this));
        materialButton.setStrokeColor(ColorStateList.valueOf((z2 || z) ? S6.A(this) : S6.d(this)));
        materialButton.setStrokeWidth(v(z2 ? 3 : (!z && zX) ? 1 : 2));
    }

    public final int v(int i) {
        return Math.round(i * getResources().getDisplayMetrics().density);
    }

    public final void w() {
        for (int i = 0; i < this.H.getChildCount(); i++) {
            View childAt = this.H.getChildAt(i);
            if (A(this.O).equalsIgnoreCase(A(String.valueOf(childAt.getTag())))) {
                childAt.requestFocus();
                return;
            }
        }
        if (this.H.getChildCount() > 0) {
            this.H.getChildAt(0).requestFocus();
        }
    }

    public final boolean x() {
        UiModeManager uiModeManager = (UiModeManager) getSystemService("uimode");
        return (uiModeManager != null && uiModeManager.getCurrentModeType() == 4) || getPackageManager().hasSystemFeature("android.software.leanback");
    }

    public final void y() {
        this.I.setVisibility(0);
        this.J.setVisibility(8);
        this.G.l(new ArrayList());
        this.H.removeAllViews();
        G8 g8 = new G8(2, this);
        if (!this.K) {
            O8.x(this, this.L, g8);
            return;
        }
        ArrayList arrayList = O8.a;
        O8.x(this, P8.h, new K8(new ArrayList(), this, g8));
    }

    public final void z() {
        List list = (List) this.N.get("Todos".equalsIgnoreCase(this.O) ? "todos" : A(this.O).toLowerCase(Locale.ROOT));
        ArrayList arrayList = list == null ? new ArrayList() : new ArrayList(list);
        AbstractC1116o9.c(arrayList);
        if (arrayList.isEmpty()) {
            this.G.l(arrayList);
            this.J.setText("No hay canales en esta categoría.");
            this.J.setVisibility(0);
            this.E.setVisibility(8);
            return;
        }
        this.J.setVisibility(8);
        this.E.setVisibility(0);
        this.G.l(arrayList);
        this.E.post(new JK(this, 0));
        if (x()) {
            return;
        }
        AbstractC1259qx.z(this, arrayList, 6);
    }
}
