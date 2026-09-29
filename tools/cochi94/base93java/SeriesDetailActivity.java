package com.cochi.client;

import android.app.UiModeManager;
import android.content.res.ColorStateList;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.cochi.client.SeriesDetailActivity;
import com.google.android.material.button.MaterialButton;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import x.AbstractC0966lF;
import x.AbstractC1070nF;
import x.AbstractC1259qx;
import x.B8;
import x.C0802i5;
import x.C0806i9;
import x.C0812iF;
import x.C0914kF;
import x.C1134oc;
import x.C1451ui;
import x.Cz;
import x.E5;
import x.H8;
import x.P8;
import x.RunnableC1052my;
import x.S6;
import x.ViewOnClickListenerC1675yy;
import x.W1;

/* loaded from: classes.dex */
public final class SeriesDetailActivity extends W1 {
    public static final /* synthetic */ int O = 0;
    public C0914kF E;
    public LinearLayout F;
    public RecyclerView G;
    public C1134oc H;
    public TextView I;
    public MaterialButton J;
    public MaterialButton K;
    public int L = 0;
    public volatile boolean M = false;
    public Runnable N;

    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_series_detail);
        S6.a(this);
        if (v()) {
            int iC = S6.c(this);
            getWindow().setStatusBarColor(iC);
            getWindow().setNavigationBarColor(iC);
            getWindow().getDecorView().setBackgroundColor(iC);
        }
        C0914kF c0914kFC = AbstractC0966lF.c(getIntent().getStringExtra("cochi.extra.SERIES_DETAIL_ID"));
        this.E = c0914kFC;
        if (c0914kFC == null || c0914kFC.j.isEmpty()) {
            Toast.makeText(this, "La serie ya no está disponible", 0).show();
            finish();
            return;
        }
        ImageView imageView = (ImageView) findViewById(R.id.seriesPoster);
        ImageView imageView2 = (ImageView) findViewById(R.id.seriesBackdrop);
        TextView textView = (TextView) findViewById(R.id.seriesTitle);
        TextView textView2 = (TextView) findViewById(R.id.seriesMeta);
        TextView textView3 = (TextView) findViewById(R.id.seriesSynopsis);
        this.F = (LinearLayout) findViewById(R.id.seasonRow);
        this.G = (RecyclerView) findViewById(R.id.episodeRecycler);
        this.I = (TextView) findViewById(R.id.episodesLabel);
        this.J = (MaterialButton) findViewById(R.id.continueButton);
        this.K = (MaterialButton) findViewById(R.id.startButton);
        AbstractC1259qx.u(this.E.c, imageView);
        AbstractC1259qx.u(this.E.d.isEmpty() ? this.E.c : this.E.d, imageView2);
        textView.setText(this.E.b);
        ArrayList arrayList = new ArrayList();
        if (!this.E.e.isEmpty()) {
            arrayList.add(this.E.e);
        }
        if (!this.E.f.isEmpty()) {
            arrayList.add(this.E.f);
        }
        arrayList.add(this.E.j.size() == 1 ? "1 temporada" : this.E.j.size() + " temporadas");
        arrayList.add(this.E.b() == 1 ? "1 capítulo" : this.E.b() + " capítulos");
        textView2.setText(TextUtils.join("  •  ", arrayList));
        textView3.setText(this.E.g.isEmpty() ? "Elegí una temporada para ver sus capítulos." : this.E.g);
        this.G.setLayoutManager(v() ? new GridLayoutManager(3) : new LinearLayoutManager(1));
        this.G.setHasFixedSize(true);
        if (v()) {
            this.G.setItemAnimator(null);
        }
        this.G.setItemViewCacheSize(10);
        C1134oc c1134oc = new C1134oc(this, new C0802i5(26, this));
        this.H = c1134oc;
        this.G.setAdapter(c1134oc);
        Cz czW = w();
        if (czW != null) {
            String str = czW.b;
            int i = 0;
            while (true) {
                if (i >= this.E.j.size()) {
                    i = 0;
                    break;
                }
                List list = ((C0812iF) this.E.j.get(i)).c;
                int i2 = 0;
                while (true) {
                    if (i2 >= list.size()) {
                        i2 = -1;
                        break;
                    } else if (((C0806i9) list.get(i2)).a.equals(str)) {
                        break;
                    } else {
                        i2++;
                    }
                }
                if (i2 >= 0) {
                    break;
                } else {
                    i++;
                }
            }
            this.L = i;
        } else {
            int i3 = 0;
            loop3: while (true) {
                if (i3 >= this.E.j.size()) {
                    i3 = 0;
                    break;
                }
                for (C0806i9 c0806i9 : ((C0812iF) this.E.j.get(i3)).c) {
                    if (E5.v(this, P8.k, c0806i9.a) != null || !E5.B(this, c0806i9.a)) {
                        break loop3;
                    }
                }
                i3++;
            }
            this.L = i3;
        }
        if (this.L < 0) {
            this.L = 0;
        }
        final int i4 = 0;
        this.J.setOnClickListener(new View.OnClickListener(this) { // from class: x.eF
            public final /* synthetic */ SeriesDetailActivity i;

            {
                this.i = this;
            }

            @Override // android.view.View.OnClickListener
            public final void onClick(View view) {
                C0806i9 c0806i9T;
                int i5 = i4;
                SeriesDetailActivity seriesDetailActivity = this.i;
                switch (i5) {
                    case 0:
                        int i6 = SeriesDetailActivity.O;
                        Cz czW2 = seriesDetailActivity.w();
                        if (czW2 != null && (c0806i9T = seriesDetailActivity.t(czW2.b)) != null) {
                            seriesDetailActivity.x(c0806i9T, false, true);
                            break;
                        } else {
                            C0806i9 c0806i9U = seriesDetailActivity.u();
                            if (c0806i9U == null && !seriesDetailActivity.E.a().isEmpty()) {
                                c0806i9U = (C0806i9) seriesDetailActivity.E.a().get(0);
                            }
                            if (c0806i9U != null) {
                                seriesDetailActivity.x(c0806i9U, false, false);
                                break;
                            }
                        }
                        break;
                    default:
                        ArrayList arrayListA = seriesDetailActivity.E.a();
                        if (!arrayListA.isEmpty()) {
                            seriesDetailActivity.x((C0806i9) arrayListA.get(0), true, false);
                            break;
                        }
                        break;
                }
            }
        });
        final int i5 = 1;
        this.K.setOnClickListener(new View.OnClickListener(this) { // from class: x.eF
            public final /* synthetic */ SeriesDetailActivity i;

            {
                this.i = this;
            }

            @Override // android.view.View.OnClickListener
            public final void onClick(View view) {
                C0806i9 c0806i9T;
                int i52 = i5;
                SeriesDetailActivity seriesDetailActivity = this.i;
                switch (i52) {
                    case 0:
                        int i6 = SeriesDetailActivity.O;
                        Cz czW2 = seriesDetailActivity.w();
                        if (czW2 != null && (c0806i9T = seriesDetailActivity.t(czW2.b)) != null) {
                            seriesDetailActivity.x(c0806i9T, false, true);
                            break;
                        } else {
                            C0806i9 c0806i9U = seriesDetailActivity.u();
                            if (c0806i9U == null && !seriesDetailActivity.E.a().isEmpty()) {
                                c0806i9U = (C0806i9) seriesDetailActivity.E.a().get(0);
                            }
                            if (c0806i9U != null) {
                                seriesDetailActivity.x(c0806i9U, false, false);
                                break;
                            }
                        }
                        break;
                    default:
                        ArrayList arrayListA = seriesDetailActivity.E.a();
                        if (!arrayListA.isEmpty()) {
                            seriesDetailActivity.x((C0806i9) arrayListA.get(0), true, false);
                            break;
                        }
                        break;
                }
            }
        });
        this.F.removeAllViews();
        for (final int i6 = 0; i6 < this.E.j.size(); i6++) {
            C0812iF c0812iF = (C0812iF) this.E.j.get(i6);
            final MaterialButton materialButton = new MaterialButton(this, null);
            materialButton.setText(c0812iF.b);
            materialButton.setAllCaps(false);
            materialButton.setFocusable(true);
            boolean zV = v();
            materialButton.setTextSize(14.0f);
            materialButton.setTypeface(Typeface.DEFAULT_BOLD);
            materialButton.setCornerRadius(s(zV ? 12 : 18));
            materialButton.setTag(Integer.valueOf(i6));
            materialButton.setOnClickListener(new ViewOnClickListenerC1675yy(i6, 1, this));
            materialButton.setOnFocusChangeListener(new View.OnFocusChangeListener() { // from class: x.fF
                @Override // android.view.View.OnFocusChangeListener
                public final void onFocusChange(View view, boolean z) {
                    int i7 = SeriesDetailActivity.O;
                    this.a.r(materialButton, i6, z);
                }
            });
            materialButton.setOnKeyListener(new B8(2, this));
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-2, s(46));
            layoutParams.setMarginEnd(s(zV ? 8 : 9));
            materialButton.setLayoutParams(layoutParams);
            this.F.addView(materialButton);
            r(materialButton, i6, false);
        }
        z();
        y();
    }

    @Override // x.W1, android.app.Activity
    public final void onResume() {
        super.onResume();
        if (!AbstractC1070nF.o0() && !this.M) {
            this.M = true;
            new Thread(new H8((W1) this, false, (Runnable) null, 2), "cochi-series-access").start();
        }
        if (this.E == null || this.H == null) {
            return;
        }
        z();
        y();
    }

    public final void r(MaterialButton materialButton, int i, boolean z) {
        int i2 = 1;
        boolean z2 = i == this.L;
        v();
        materialButton.setBackgroundTintList(ColorStateList.valueOf(z2 ? S6.J(this) : S6.g(this)));
        materialButton.setTextColor(S6.P(this));
        materialButton.setStrokeColor(ColorStateList.valueOf((z || z2) ? S6.A(this) : S6.d(this)));
        if (z) {
            i2 = 3;
        } else if (z2) {
            i2 = 2;
        }
        materialButton.setStrokeWidth(s(i2));
    }

    public final int s(int i) {
        return Math.round(i * getResources().getDisplayMetrics().density);
    }

    public final C0806i9 t(String str) {
        ArrayList arrayListA = this.E.a();
        int size = arrayListA.size();
        int i = 0;
        while (i < size) {
            Object obj = arrayListA.get(i);
            i++;
            C0806i9 c0806i9 = (C0806i9) obj;
            if (c0806i9.a.equals(str)) {
                return c0806i9;
            }
        }
        return null;
    }

    public final C0806i9 u() {
        ArrayList arrayListA = this.E.a();
        int size = arrayListA.size();
        int i = 0;
        while (i < size) {
            Object obj = arrayListA.get(i);
            i++;
            C0806i9 c0806i9 = (C0806i9) obj;
            if (E5.v(this, P8.k, c0806i9.a) != null || !E5.B(this, c0806i9.a)) {
                return c0806i9;
            }
        }
        return null;
    }

    public final boolean v() {
        UiModeManager uiModeManager = (UiModeManager) getSystemService("uimode");
        return (uiModeManager != null && uiModeManager.getCurrentModeType() == 4) || getPackageManager().hasSystemFeature("android.software.leanback");
    }

    public final Cz w() {
        ArrayList arrayListA = this.E.a();
        int size = arrayListA.size();
        Cz cz = null;
        int i = 0;
        while (i < size) {
            Object obj = arrayListA.get(i);
            i++;
            Cz czV = E5.v(this, P8.k, ((C0806i9) obj).a);
            if (czV != null && (cz == null || czV.g > cz.g)) {
                cz = czV;
            }
        }
        return cz;
    }

    public final void x(C0806i9 c0806i9, boolean z, boolean z2) {
        RunnableC1052my runnableC1052my = new RunnableC1052my(this, c0806i9, z, z2, 2);
        if (AbstractC1070nF.o0()) {
            runnableC1052my.run();
        } else if (this.M) {
            this.N = runnableC1052my;
        } else {
            this.M = true;
            new Thread(new H8((W1) this, true, (Runnable) runnableC1052my, 2), "cochi-series-access").start();
        }
    }

    public final void y() {
        C0806i9 c0806i9T;
        Cz czW = w();
        if (czW != null && (c0806i9T = t(czW.b)) != null) {
            this.J.setText("CONTINUAR · EP ".concat(String.format(Locale.US, "%02d", Integer.valueOf(c0806i9T.b))));
            this.J.setEnabled(true);
            return;
        }
        C0806i9 c0806i9U = u();
        if (c0806i9U != null) {
            this.J.setText("REPRODUCIR · EP ".concat(String.format(Locale.US, "%02d", Integer.valueOf(c0806i9U.b))));
            this.J.setEnabled(true);
        } else {
            this.J.setText("VER DE NUEVO");
            this.J.setEnabled(!this.E.a().isEmpty());
        }
    }

    public final void z() {
        int i = this.L;
        if (i < 0 || i >= this.E.j.size()) {
            return;
        }
        C0812iF c0812iF = (C0812iF) this.E.j.get(this.L);
        TextView textView = this.I;
        StringBuilder sb = new StringBuilder();
        String str = c0812iF.b;
        List<C0806i9> list = c0812iF.c;
        sb.append(str);
        sb.append("  ·  ");
        sb.append(list.size());
        sb.append(list.size() == 1 ? " CAPÍTULO" : " CAPÍTULOS");
        textView.setText(sb.toString().toUpperCase(Locale.ROOT));
        ArrayList arrayList = new ArrayList();
        for (C0806i9 c0806i9 : list) {
            Cz czV = E5.v(this, P8.k, c0806i9.a);
            arrayList.add(new C1451ui(c0806i9, czV != null ? "Continuar · " + czV.a() + "%" : E5.B(this, c0806i9.a) ? "✓ Visto" : ""));
        }
        C1134oc c1134oc = this.H;
        ArrayList arrayList2 = c1134oc.e;
        arrayList2.clear();
        arrayList2.addAll(arrayList);
        c1134oc.c();
        AbstractC1259qx.z(this, list, v() ? 6 : 10);
    }
}
