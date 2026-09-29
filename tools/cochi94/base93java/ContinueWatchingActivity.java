package com.cochi.client;

import android.os.Bundle;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import x.C0951l0;
import x.C1134oc;
import x.Cz;
import x.E5;
import x.K8;
import x.O8;
import x.P8;
import x.S6;
import x.W1;

/* loaded from: classes.dex */
public class ContinueWatchingActivity extends W1 {
    public static final /* synthetic */ int H = 0;
    public C1134oc E;
    public TextView F;
    public ProgressBar G;

    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_continue_watching);
        S6.a(this);
        RecyclerView recyclerView = (RecyclerView) findViewById(R.id.continueRecycler);
        this.F = (TextView) findViewById(R.id.continueEmpty);
        this.G = (ProgressBar) findViewById(R.id.continueLoading);
        recyclerView.setLayoutManager(new LinearLayoutManager(1));
        C1134oc c1134oc = new C1134oc(this, new C0951l0(16, this));
        this.E = c1134oc;
        recyclerView.setAdapter(c1134oc);
    }

    @Override // x.W1, android.app.Activity
    public final void onResume() {
        super.onResume();
        s();
    }

    public final void r(Cz cz) {
        P8 p8ValueOf;
        try {
            p8ValueOf = P8.valueOf(cz.a);
        } catch (Exception unused) {
            Toast.makeText(this, "Contenido no disponible", 0).show();
            p8ValueOf = null;
        }
        if (p8ValueOf == null) {
            return;
        }
        this.G.setVisibility(0);
        O8.x(this, p8ValueOf, new K8(this, p8ValueOf, cz));
    }

    public final void s() {
        ArrayList arrayListW = E5.w(this);
        C1134oc c1134oc = this.E;
        ArrayList arrayList = c1134oc.e;
        arrayList.clear();
        arrayList.addAll(arrayListW);
        c1134oc.c();
        this.F.setVisibility(arrayListW.isEmpty() ? 0 : 8);
    }
}
