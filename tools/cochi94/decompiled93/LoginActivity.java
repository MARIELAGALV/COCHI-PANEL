package com.cochi.client;

import android.app.UiModeManager;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import com.cochi.client.LoginActivity;
import java.lang.reflect.InvocationTargetException;
import x.AbstractC1070nF;
import x.N0;
import x.RunnableC1112o5;
import x.Ur;
import x.ViewOnFocusChangeListenerC0024Bj;
import x.W1;

/* loaded from: classes.dex */
public class LoginActivity extends W1 {
    public static final /* synthetic */ int J = 0;
    public TextView F;
    public TextView G;
    public volatile boolean H;
    public final Handler E = new Handler(Looper.getMainLooper());
    public final RunnableC1112o5 I = new RunnableC1112o5(10, this);

    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_login);
        this.F = (TextView) findViewById(R.id.activationCode);
        TextView textView = (TextView) findViewById(R.id.activationDevice);
        this.G = (TextView) findViewById(R.id.activationStatus);
        Button button = (Button) findViewById(R.id.activationCopy);
        Button button2 = (Button) findViewById(R.id.activationCheck);
        textView.setText(Build.MANUFACTURER + " " + Build.MODEL);
        this.F.setText(AbstractC1070nF.c(this));
        this.G.setText("Conectando con CO-CHI PANEL…");
        final int i = 0;
        button.setOnClickListener(new View.OnClickListener(this) { // from class: x.Tr
            public final /* synthetic */ LoginActivity i;

            {
                this.i = this;
            }

            @Override // android.view.View.OnClickListener
            public final void onClick(View view) {
                int i2 = i;
                LoginActivity loginActivity = this.i;
                switch (i2) {
                    case 0:
                        int i3 = LoginActivity.J;
                        loginActivity.getClass();
                        String strC = AbstractC1070nF.c(loginActivity);
                        if (!strC.startsWith("----")) {
                            ClipboardManager clipboardManager = (ClipboardManager) loginActivity.getSystemService("clipboard");
                            if (clipboardManager != null) {
                                clipboardManager.setPrimaryClip(ClipData.newPlainText("Código CO-CHI", strC));
                                Toast.makeText(loginActivity, "Código copiado", 0).show();
                                break;
                            }
                        } else {
                            Toast.makeText(loginActivity, "Esperá a que se genere el código", 0).show();
                            break;
                        }
                        break;
                    default:
                        int i4 = LoginActivity.J;
                        loginActivity.r(true);
                        break;
                }
            }
        });
        final int i2 = 1;
        button2.setOnClickListener(new View.OnClickListener(this) { // from class: x.Tr
            public final /* synthetic */ LoginActivity i;

            {
                this.i = this;
            }

            @Override // android.view.View.OnClickListener
            public final void onClick(View view) {
                int i22 = i2;
                LoginActivity loginActivity = this.i;
                switch (i22) {
                    case 0:
                        int i3 = LoginActivity.J;
                        loginActivity.getClass();
                        String strC = AbstractC1070nF.c(loginActivity);
                        if (!strC.startsWith("----")) {
                            ClipboardManager clipboardManager = (ClipboardManager) loginActivity.getSystemService("clipboard");
                            if (clipboardManager != null) {
                                clipboardManager.setPrimaryClip(ClipData.newPlainText("Código CO-CHI", strC));
                                Toast.makeText(loginActivity, "Código copiado", 0).show();
                                break;
                            }
                        } else {
                            Toast.makeText(loginActivity, "Esperá a que se genere el código", 0).show();
                            break;
                        }
                        break;
                    default:
                        int i4 = LoginActivity.J;
                        loginActivity.r(true);
                        break;
                }
            }
        });
        button.setOnFocusChangeListener(new ViewOnFocusChangeListenerC0024Bj(1));
        button2.setOnFocusChangeListener(new ViewOnFocusChangeListenerC0024Bj(1));
        UiModeManager uiModeManager = (UiModeManager) getSystemService("uimode");
        if ((uiModeManager != null && uiModeManager.getCurrentModeType() == 4) || getPackageManager().hasSystemFeature("android.software.leanback")) {
            button2.post(new N0(25, button2));
        }
        if (this.H) {
            return;
        }
        this.H = true;
        new Thread(new Ur(this, 1), "cochi-register").start();
    }

    @Override // x.W1, android.app.Activity
    public final void onStart() throws IllegalAccessException, NoSuchFieldException, PackageManager.NameNotFoundException, SecurityException, IllegalArgumentException {
        super.onStart();
        this.E.postDelayed(this.I, 2500L);
    }

    @Override // x.W1, android.app.Activity
    public final void onStop() throws IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException {
        this.E.removeCallbacks(this.I);
        super.onStop();
    }

    public final void r(boolean z) {
        if (this.H) {
            return;
        }
        if (AbstractC1070nF.r(this).isEmpty()) {
            if (this.H) {
                return;
            }
            this.H = true;
            new Thread(new Ur(this, 1), "cochi-register").start();
            return;
        }
        this.H = true;
        if (z) {
            this.G.setText("Comprobando estado…");
        }
        new Thread(new Ur(this, 0), "cochi-activation-check").start();
    }
}
