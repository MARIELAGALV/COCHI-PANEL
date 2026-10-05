package com.cochi.client;

import android.content.Intent;
import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import x.AbstractC0966lF;
import x.AbstractC1116o9;
import x.AbstractC1259qx;
import x.C0802i5;
import x.C0914kF;
import x.C1012m9;
import x.H8;
import x.Px;
import x.S6;
import x.W1;

/* loaded from: classes.dex */
public final class SeriesEpisodesActivity extends W1 {
    public static final /* synthetic */ int I = 0;
    public RecyclerView E;
    public C1012m9 F;
    public TextView G;
    public volatile boolean H = false;

    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) {
        Collection collectionA;
        super.onCreate(bundle);
        setContentView(R.layout.activity_catalog);
        S6.a(this);
        String stringExtra = getIntent().getStringExtra("cochi.extra.SERIES_ID");
        String stringExtra2 = getIntent().getStringExtra("cochi.extra.SERIES_NAME");
        if (stringExtra2 == null || stringExtra2.trim().isEmpty()) {
            stringExtra2 = "SERIE";
        }
        TextView textView = (TextView) findViewById(R.id.catalogTitle);
        TextView textView2 = (TextView) findViewById(R.id.catalogSubtitle);
        LinearLayout linearLayout = (LinearLayout) findViewById(R.id.categoryRow);
        ProgressBar progressBar = (ProgressBar) findViewById(R.id.catalogLoading);
        this.G = (TextView) findViewById(R.id.emptyText);
        this.E = (RecyclerView) findViewById(R.id.itemRecycler);
        textView.setText(stringExtra2.toUpperCase());
        textView2.setText("Elegí un capítulo");
        linearLayout.setVisibility(8);
        progressBar.setVisibility(8);
        Map map = AbstractC0966lF.a;
        synchronized (AbstractC0966lF.class) {
            try {
                C0914kF c0914kF = (C0914kF) AbstractC0966lF.a.get(stringExtra);
                collectionA = c0914kF == null ? Collections.EMPTY_LIST : c0914kF.a();
            } catch (Throwable th) {
                throw th;
            }
        }
        ArrayList arrayList = new ArrayList(collectionA);
        AbstractC1116o9.c(arrayList);
        this.E.setLayoutManager(new LinearLayoutManager(1));
        this.E.setHasFixedSize(true);
        this.E.setItemViewCacheSize(10);
        C1012m9 c1012m9 = new C1012m9(this, 2, new C0802i5(27, this));
        this.F = c1012m9;
        this.E.setAdapter(c1012m9);
        if (arrayList.isEmpty()) {
            this.G.setText("No hay capítulos disponibles para esta serie.");
            this.G.setVisibility(0);
            this.E.setVisibility(8);
        } else {
            this.G.setVisibility(8);
            this.E.setVisibility(0);
            this.F.l(arrayList);
            AbstractC1259qx.z(this, arrayList, 14);
            this.E.post(new Px(5, this));
        }
    }

    @Override // x.W1, android.app.Activity
    public final void onResume() {
        super.onResume();
        if (this.H) {
            return;
        }
        this.H = true;
        new Thread(new H8((W1) this, false, (Runnable) null, 3), "cochi-series-access").start();
    }

    public final void r(int i) {
        Intent intent = new Intent(this, (Class<?>) PlayerActivity.class);
        intent.putExtra("cochi.extra.STORE_ITEM", true);
        intent.putExtra("cochi.extra.CHANNEL_INDEX", i);
        intent.putExtra("cochi.extra.CATALOG_SOURCE", "SERIES");
        startActivity(intent);
    }
}
