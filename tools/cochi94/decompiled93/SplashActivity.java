package com.cochi.client;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.util.concurrent.atomic.AtomicBoolean;
import x.AbstractC1070nF;
import x.AbstractC1232qL;
import x.C0802i5;
import x.HG;
import x.QK;
import x.W1;

/* loaded from: classes.dex */
public class SplashActivity extends W1 {
    public static final /* synthetic */ int H = 0;
    public TextView E;
    public View F;
    public boolean G = false;

    public static void r(SplashActivity splashActivity) {
        if (splashActivity.G || splashActivity.isFinishing() || AbstractC1232qL.e(splashActivity)) {
            return;
        }
        splashActivity.G = true;
        if (!AbstractC1070nF.K(splashActivity)) {
            splashActivity.s();
        } else {
            splashActivity.E.setText("Comprobando vigencia…");
            new Thread(new HG(splashActivity, 0), "cochi-launch-access-refresh").start();
        }
    }

    @Override // x.AbstractActivityC0340Xa, android.app.Activity
    public final void onBackPressed() {
        if (AbstractC1232qL.e(this)) {
            Toast.makeText(this, "Instalá la actualización para continuar con CO-CHI", 0).show();
        } else {
            super.onBackPressed();
        }
    }

    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) throws IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException {
        super.onCreate(bundle);
        if (!QK.W(this)) {
            Toast.makeText(this, "Instalación de CO-CHI no válida", 1).show();
            finish();
            return;
        }
        setContentView(R.layout.activity_splash);
        this.E = (TextView) findViewById(R.id.updateStatus);
        View viewFindViewById = findViewById(R.id.updateAction);
        this.F = viewFindViewById;
        AbstractC1232qL.a(this.E, this, viewFindViewById, new C0802i5(28, this));
    }

    @Override // x.W1, android.app.Activity
    public final void onResume() {
        super.onResume();
        TextView textView = this.E;
        View view = this.F;
        C0802i5 c0802i5 = new C0802i5(28, this);
        AtomicBoolean atomicBoolean = AbstractC1232qL.b;
        AtomicBoolean atomicBoolean2 = AbstractC1232qL.c;
        try {
            if (atomicBoolean2.compareAndSet(false, true)) {
                String string = getSharedPreferences("cochi_updater", 0).getString("pending_version", "");
                String string2 = getSharedPreferences("cochi_updater", 0).getString("pending_apk", "");
                if (string != null && !string.trim().isEmpty()) {
                    if (!AbstractC1232qL.i(string, AbstractC1232qL.h(this))) {
                        AbstractC1232qL.b(this);
                        AbstractC1232qL.f(view);
                        atomicBoolean.set(false);
                        c0802i5.i();
                        return;
                    }
                    File file = string2 == null ? null : new File(string2);
                    if (file != null && file.isFile()) {
                        boolean z = getSharedPreferences("cochi_updater", 0).getBoolean("awaiting_permission", false);
                        if (Build.VERSION.SDK_INT >= 26 && !getPackageManager().canRequestPackageInstalls()) {
                            AbstractC1232qL.k(textView, "Actualización obligatoria · habilitá CO-CHI para instalarla");
                            AbstractC1232qL.l(view, textView, this, file);
                            return;
                        } else if (z) {
                            getSharedPreferences("cochi_updater", 0).edit().putBoolean("awaiting_permission", false).apply();
                            AbstractC1232qL.k(textView, "Permiso listo · abriendo actualización…");
                            AbstractC1232qL.g(view, textView, this, file);
                            return;
                        } else {
                            AbstractC1232qL.k(textView, "Actualización obligatoria " + string + " · instalá para continuar");
                            AbstractC1232qL.l(view, textView, this, file);
                            return;
                        }
                    }
                    AbstractC1232qL.b(this);
                    atomicBoolean.set(false);
                    AbstractC1232qL.k(textView, "Actualización pendiente · descargando nuevamente…");
                    AbstractC1232qL.a(textView, this, view, c0802i5);
                }
            }
        } catch (Exception unused) {
            AbstractC1232qL.k(textView, "Actualización obligatoria · reintentá la instalación");
        } finally {
            atomicBoolean2.set(false);
        }
    }

    public final void s() {
        if (isFinishing()) {
            return;
        }
        startActivity(!AbstractC1070nF.K(this) ? new Intent(this, (Class<?>) LoginActivity.class) : AbstractC1070nF.N(this) ? new Intent(this, (Class<?>) ExpiredActivity.class) : new Intent(this, (Class<?>) MainActivity.class));
        finish();
    }
}
