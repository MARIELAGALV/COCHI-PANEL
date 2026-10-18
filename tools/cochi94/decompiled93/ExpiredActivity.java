package com.cochi.client;

import android.app.UiModeManager;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import x.AbstractC1070nF;
import x.D8;
import x.N0;
import x.ViewOnClickListenerC1686z8;
import x.ViewOnFocusChangeListenerC0024Bj;
import x.W1;

/* loaded from: classes.dex */
public class ExpiredActivity extends W1 {
    public static final /* synthetic */ int E = 0;

    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) throws IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException {
        super.onCreate(bundle);
        if (!AbstractC1070nF.K(this)) {
            Intent intent = new Intent(this, (Class<?>) LoginActivity.class);
            intent.addFlags(335577088);
            startActivity(intent);
            finish();
            return;
        }
        if (!AbstractC1070nF.N(this)) {
            Intent intent2 = new Intent(this, (Class<?>) MainActivity.class);
            intent2.addFlags(335577088);
            startActivity(intent2);
            finish();
            return;
        }
        setContentView(R.layout.activity_expired);
        ((TextView) findViewById(R.id.expiredDetail)).setText("Tu servicio venció el " + new SimpleDateFormat("dd/MM/yyyy HH:mm:ss", Locale.getDefault()).format(new Date(AbstractC1070nF.W(this).getLong("expires_at_ms", 0L))) + ".\nLa fecha y hora son únicas para todos tus dispositivos.\nContactá a tu vendedor para renovar.");
        Button button = (Button) findViewById(R.id.expiredCheckButton);
        button.setOnClickListener(new ViewOnClickListenerC1686z8(this, 3, button));
        View viewFindViewById = findViewById(R.id.expiredUnlinkButton);
        viewFindViewById.setOnClickListener(new D8(3, this));
        button.setOnFocusChangeListener(new ViewOnFocusChangeListenerC0024Bj(0));
        viewFindViewById.setOnFocusChangeListener(new ViewOnFocusChangeListenerC0024Bj(0));
        UiModeManager uiModeManager = (UiModeManager) getSystemService("uimode");
        if ((uiModeManager == null || uiModeManager.getCurrentModeType() != 4) && !getPackageManager().hasSystemFeature("android.software.leanback")) {
            return;
        }
        button.post(new N0(25, button));
    }
}
