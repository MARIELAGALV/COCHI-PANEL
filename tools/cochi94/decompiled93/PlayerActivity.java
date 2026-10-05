package com.cochi.client;

import android.app.UiModeManager;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.media3.ui.PlayerView;
import com.cochi.client.PlayerActivity;
import com.google.android.material.button.MaterialButton;
import com.tuempresa.motor.MotorPrivado;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.json.JSONObject;
import x.AbstractC0192Mm;
import x.AbstractC0863jG;
import x.AbstractC0966lF;
import x.AbstractC1070nF;
import x.AbstractC1116o9;
import x.AbstractC1259qx;
import x.AbstractC1425u7;
import x.C0139Je;
import x.C0162Km;
import x.C0177Lm;
import x.C0273Sd;
import x.C0314Vc;
import x.C0336Wk;
import x.C0376Zi;
import x.C0413af;
import x.C0475bp;
import x.C0515ce;
import x.C0609eK;
import x.C0619ef;
import x.C0760hF;
import x.C0802i5;
import x.C0806i9;
import x.C0812iF;
import x.C0839is;
import x.C0848j1;
import x.C0914kF;
import x.C0934kk;
import x.C1044mq;
import x.C1056n1;
import x.C1089nj;
import x.C1318s4;
import x.C1363sy;
import x.C1447ue;
import x.C1448uf;
import x.C1481vB;
import x.C1514vt;
import x.C1725zw;
import x.Cz;
import x.E5;
import x.Gy;
import x.Ht;
import x.It;
import x.Jt;
import x.Kt;
import x.Lt;
import x.Nt;
import x.P8;
import x.Py;
import x.QK;
import x.Rt;
import x.RunnableC0586dy;
import x.RunnableC0690fy;
import x.RunnableC0742gy;
import x.RunnableC0844iy;
import x.RunnableC1052my;
import x.RunnableC1311ry;
import x.RunnableC1422u4;
import x.ViewOnClickListenerC0638ey;
import x.W1;
import x.W6;
import x.Y5;

/* loaded from: classes.dex */
public class PlayerActivity extends W1 {
    public static final long[] z0 = {300, 700, 1400, 2500};
    public C1089nj E;
    public PlayerView F;
    public WebView G;
    public ProgressBar H;
    public View I;
    public TextView J;
    public TextView K;
    public View L;
    public MaterialButton M;
    public MaterialButton N;
    public MaterialButton O;
    public View P;
    public ImageButton Q;
    public ImageButton R;
    public ImageButton S;
    public boolean X;
    public boolean Y;
    public P8 Z;
    public C0806i9 g0;
    public RunnableC0690fy h0;
    public RunnableC0690fy i0;
    public boolean j0;
    public boolean k0;
    public boolean l0;
    public RunnableC1422u4 m0;
    public boolean o0;
    public boolean p0;
    public boolean q0;
    public boolean r0;
    public volatile boolean s0;
    public boolean t0;
    public Runnable u0;
    public C0760hF T = new C0760hF(null, null, -1);
    public final Handler U = new Handler(Looper.getMainLooper());
    public final RunnableC0586dy V = new RunnableC0586dy(this, 0);
    public final ExecutorService W = Executors.newSingleThreadExecutor();
    public int a0 = 0;
    public int b0 = 0;
    public int c0 = -1;
    public int d0 = 0;
    public long e0 = 0;
    public int f0 = 0;
    public final RunnableC1311ry n0 = new RunnableC1311ry(this, 0);
    public final RunnableC1311ry v0 = new RunnableC1311ry(this, 1);
    public final RunnableC1311ry w0 = new RunnableC1311ry(this, 2);
    public final RunnableC1311ry x0 = new RunnableC1311ry(this, 3);
    public final RunnableC1311ry y0 = new RunnableC1311ry(this, 4);

    public static byte[] C(String str) {
        String strTrim = str.replace("-", "").replace(" ", "").trim();
        if (!G(strTrim)) {
            throw new IllegalArgumentException("KID/KEY inválido");
        }
        byte[] bArr = new byte[strTrim.length() / 2];
        int i = 0;
        while (i < strTrim.length()) {
            int i2 = i + 2;
            bArr[i / 2] = (byte) Integer.parseInt(strTrim.substring(i, i2), 16);
            i = i2;
        }
        return bArr;
    }

    public static boolean G(String str) {
        return str.length() == 32 && str.matches("(?i)[0-9a-f]{32}");
    }

    public static String I(String str) {
        byte[] bArrDecode;
        if (str != null) {
            String strTrim = str.trim();
            String strTrim2 = strTrim == null ? "" : strTrim.replace("-", "").replace(" ", "").trim();
            if (G(strTrim2)) {
                return strTrim2.toLowerCase(Locale.ROOT);
            }
            try {
                int length = strTrim.length() % 4;
                if (length != 0) {
                    strTrim = strTrim + "====".substring(length);
                }
                try {
                    bArrDecode = Base64.decode(strTrim, 2);
                } catch (IllegalArgumentException unused) {
                    bArrDecode = Base64.decode(strTrim, 10);
                }
                if (bArrDecode.length == 16) {
                    StringBuilder sb = new StringBuilder(32);
                    for (byte b : bArrDecode) {
                        sb.append(String.format(Locale.US, "%02x", Integer.valueOf(b & 255)));
                    }
                    return sb.toString();
                }
            } catch (Exception unused2) {
            }
        }
        return "";
    }

    public static ArrayList J(String str) {
        String strTrim = str == null ? "" : str.trim();
        if (strTrim.isEmpty()) {
            throw new IllegalArgumentException("Faltan claves ClearKey");
        }
        String[] strArrSplit = strTrim.split("[\\r\\n,;]+");
        ArrayList arrayList = new ArrayList();
        for (String str2 : strArrSplit) {
            String strTrim2 = str2.trim();
            if (!strTrim2.isEmpty()) {
                String[] strArrSplit2 = strTrim2.split("\\s*:\\s*");
                if (strArrSplit2.length < 2) {
                    strArrSplit2 = strTrim2.split("\\s*[|=]\\s*", 2);
                }
                if (strArrSplit2.length < 2) {
                    throw new IllegalArgumentException("Formato ClearKey inválido");
                }
                boolean z = strArrSplit2.length >= 3 && "max".equalsIgnoreCase(strArrSplit2[0].trim());
                String strI = I(strArrSplit2[strArrSplit2.length - 2]);
                String strI2 = I(strArrSplit2[strArrSplit2.length - 1]);
                if (!G(strI) || !G(strI2)) {
                    throw new IllegalArgumentException("KID/KEY inválido");
                }
                String str3 = z ? strI2 : strI;
                if (!z) {
                    strI = strI2;
                }
                r(arrayList, str3, strI);
            }
        }
        if (arrayList.isEmpty()) {
            throw new IllegalArgumentException("Faltan claves ClearKey");
        }
        return arrayList;
    }

    public static void r(ArrayList arrayList, String str, String str2) {
        int size = arrayList.size();
        int i = 0;
        while (i < size) {
            Object obj = arrayList.get(i);
            i++;
            C1363sy c1363sy = (C1363sy) obj;
            if (c1363sy.a.equalsIgnoreCase(str) && c1363sy.b.equalsIgnoreCase(str2)) {
                return;
            }
        }
        arrayList.add(new C1363sy(str, str2));
    }

    public static String w(ArrayList arrayList) {
        StringBuilder sb = new StringBuilder("{\"keys\":[");
        for (int i = 0; i < arrayList.size(); i++) {
            C1363sy c1363sy = (C1363sy) arrayList.get(i);
            if (i > 0) {
                sb.append(',');
            }
            String strEncodeToString = Base64.encodeToString(C(c1363sy.a), 11);
            String strEncodeToString2 = Base64.encodeToString(C(c1363sy.b), 11);
            sb.append("{\"kty\":\"oct\",\"kid\":\"");
            sb.append(strEncodeToString);
            sb.append("\",\"k\":\"");
            sb.append(strEncodeToString2);
            sb.append("\"}");
        }
        sb.append("],\"type\":\"temporary\"}");
        return sb.toString();
    }

    public static Nt y(C0806i9 c0806i9, String str) {
        C0934kk c0934kk = new C0934kk();
        new C1514vt();
        List list = Collections.EMPTY_LIST;
        C1481vB c1481vB = C1481vB.l;
        It it = new It();
        Lt lt = Lt.a;
        String str2 = null;
        Uri uri = str == null ? null : Uri.parse(str);
        String str3 = c0806i9.d;
        String lowerCase = str3 == null ? "" : str3.trim().toLowerCase(Locale.ROOT);
        if ("hls".equals(lowerCase) || "m3u8".equals(lowerCase)) {
            str2 = "application/x-mpegURL";
        } else if ("dash".equals(lowerCase) || "mpd".equals(lowerCase)) {
            str2 = "application/dash+xml";
        }
        return new Nt("", new Ht(c0934kk), uri != null ? new Kt(uri, str2, null, list, c1481vB, -9223372036854775807L) : null, new Jt(it), Rt.C, lt);
    }

    public final void A() {
        RunnableC0690fy runnableC0690fy = this.h0;
        Handler handler = this.U;
        if (runnableC0690fy != null) {
            handler.removeCallbacks(runnableC0690fy);
            this.h0 = null;
        }
        RunnableC0690fy runnableC0690fy2 = this.i0;
        if (runnableC0690fy2 != null) {
            handler.removeCallbacks(runnableC0690fy2);
            this.i0 = null;
        }
    }

    public final void B() {
        RunnableC1422u4 runnableC1422u4 = this.m0;
        if (runnableC1422u4 != null) {
            this.U.removeCallbacks(runnableC1422u4);
            this.m0 = null;
        }
    }

    public final void D() {
        PlayerView playerView;
        if (!this.X || (playerView = this.F) == null) {
            return;
        }
        playerView.e();
        PlayerView playerView2 = this.F;
        Objects.requireNonNull(playerView2);
        RunnableC0844iy runnableC0844iy = new RunnableC0844iy(playerView2, 0);
        Handler handler = this.U;
        handler.post(runnableC0844iy);
        PlayerView playerView3 = this.F;
        Objects.requireNonNull(playerView3);
        handler.postDelayed(new RunnableC0844iy(playerView3, 0), 120L);
        PlayerView playerView4 = this.F;
        Objects.requireNonNull(playerView4);
        handler.postDelayed(new RunnableC0844iy(playerView4, 0), 350L);
    }

    public final void E() {
        View view = this.L;
        if (view != null) {
            view.setVisibility(8);
        }
        MaterialButton materialButton = this.M;
        if (materialButton != null) {
            materialButton.setVisibility(8);
        }
        MaterialButton materialButton2 = this.N;
        if (materialButton2 != null) {
            materialButton2.setVisibility(8);
        }
        MaterialButton materialButton3 = this.O;
        if (materialButton3 != null) {
            materialButton3.setVisibility(8);
        }
    }

    public final void F() {
        float f;
        ImageButton imageButton;
        PlayerView playerView = this.F;
        if (playerView == null) {
            return;
        }
        View viewFindViewById = playerView.findViewById(R.id.exo_prev);
        View viewFindViewById2 = this.F.findViewById(R.id.exo_next);
        View viewFindViewById3 = this.F.findViewById(R.id.exo_rew);
        if (viewFindViewById3 == null) {
            viewFindViewById3 = this.F.findViewById(R.id.exo_rew_with_amount);
        }
        View viewFindViewById4 = this.F.findViewById(R.id.exo_ffwd);
        if (viewFindViewById4 == null) {
            viewFindViewById4 = this.F.findViewById(R.id.exo_ffwd_with_amount);
        }
        View viewFindViewById5 = this.F.findViewById(R.id.exo_settings);
        View viewFindViewById6 = this.F.findViewById(R.id.exo_play_pause);
        View viewFindViewById7 = this.F.findViewById(R.id.exo_progress);
        C1089nj c1089nj = this.E;
        boolean z = true;
        boolean z2 = c1089nj != null && c1089nj.g();
        boolean zH = H();
        final boolean z3 = this.X && AbstractC1116o9.d() > 1;
        if (viewFindViewById != null) {
            boolean z4 = this.X;
            if (z4 && zH) {
                viewFindViewById.setEnabled(z2);
                viewFindViewById.setAlpha(z2 ? 1.0f : 0.35f);
                viewFindViewById.setContentDescription("Retroceder 5 minutos ");
                viewFindViewById.setOnClickListener(new ViewOnClickListenerC0638ey(this, 1));
            } else if (z4) {
                viewFindViewById.setEnabled(z3);
                viewFindViewById.setAlpha(z3 ? 1.0f : 0.35f);
                viewFindViewById.setContentDescription("Canal anterior");
                final int i = 0;
                viewFindViewById.setOnClickListener(new View.OnClickListener(this) { // from class: x.hy
                    public final /* synthetic */ PlayerActivity i;

                    {
                        this.i = this;
                    }

                    @Override // android.view.View.OnClickListener
                    public final void onClick(View view) {
                        int i2 = i;
                        boolean z5 = z3;
                        PlayerActivity playerActivity = this.i;
                        switch (i2) {
                            case 0:
                                long[] jArr = PlayerActivity.z0;
                                if (!z5) {
                                    playerActivity.getClass();
                                    break;
                                } else {
                                    playerActivity.d0(-1);
                                    break;
                                }
                            default:
                                long[] jArr2 = PlayerActivity.z0;
                                if (!z5) {
                                    playerActivity.getClass();
                                    break;
                                } else {
                                    playerActivity.d0(1);
                                    break;
                                }
                        }
                    }
                });
            } else {
                viewFindViewById.setVisibility(4);
                viewFindViewById.setEnabled(false);
            }
        }
        if (viewFindViewById2 != null) {
            boolean z5 = this.X;
            if (z5 && zH) {
                viewFindViewById2.setEnabled(z2);
                viewFindViewById2.setAlpha(z2 ? 1.0f : 0.35f);
                viewFindViewById2.setContentDescription("Avanzar 5 minutos ");
                viewFindViewById2.setOnClickListener(new ViewOnClickListenerC0638ey(this, 2));
            } else if (z5) {
                viewFindViewById2.setEnabled(z3);
                viewFindViewById2.setAlpha(z3 ? 1.0f : 0.35f);
                viewFindViewById2.setContentDescription("Canal siguiente");
                final int i2 = 1;
                viewFindViewById2.setOnClickListener(new View.OnClickListener(this) { // from class: x.hy
                    public final /* synthetic */ PlayerActivity i;

                    {
                        this.i = this;
                    }

                    @Override // android.view.View.OnClickListener
                    public final void onClick(View view) {
                        int i22 = i2;
                        boolean z52 = z3;
                        PlayerActivity playerActivity = this.i;
                        switch (i22) {
                            case 0:
                                long[] jArr = PlayerActivity.z0;
                                if (!z52) {
                                    playerActivity.getClass();
                                    break;
                                } else {
                                    playerActivity.d0(-1);
                                    break;
                                }
                            default:
                                long[] jArr2 = PlayerActivity.z0;
                                if (!z52) {
                                    playerActivity.getClass();
                                    break;
                                } else {
                                    playerActivity.d0(1);
                                    break;
                                }
                        }
                    }
                });
            } else {
                viewFindViewById2.setVisibility(4);
                viewFindViewById2.setEnabled(false);
            }
        }
        if (viewFindViewById3 != null) {
            viewFindViewById3.setOnClickListener(new ViewOnClickListenerC0638ey(this, 3));
        }
        if (viewFindViewById4 != null) {
            viewFindViewById4.setOnClickListener(new ViewOnClickListenerC0638ey(this, 4));
        }
        if (viewFindViewById5 == null) {
            f = 1.0f;
        } else if (zH) {
            viewFindViewById5.setEnabled(true);
            viewFindViewById5.setClickable(true);
            f = 1.0f;
            viewFindViewById5.setAlpha(1.0f);
            viewFindViewById5.setVisibility(0);
            viewFindViewById5.setOnClickListener(new ViewOnClickListenerC0638ey(this, 5));
        } else {
            f = 1.0f;
            viewFindViewById5.setVisibility(4);
            viewFindViewById5.setEnabled(false);
            viewFindViewById5.setClickable(false);
        }
        if (zH) {
            s(viewFindViewById);
            s(viewFindViewById3);
            s(viewFindViewById6);
            s(viewFindViewById4);
            s(viewFindViewById2);
            s(viewFindViewById5);
            if (this.Y && !this.X) {
                s(this.Q);
                s(this.R);
            }
        }
        if (zH && this.Y && !this.X && (imageButton = this.Q) != null && this.R != null) {
            imageButton.setFocusable(true);
            this.Q.setFocusableInTouchMode(false);
            this.R.setFocusable(true);
            this.R.setFocusableInTouchMode(false);
            if (viewFindViewById3 != null) {
                this.Q.setNextFocusRightId(viewFindViewById3.getId());
                viewFindViewById3.setNextFocusLeftId(this.Q.getId());
            }
            if (viewFindViewById3 != null && viewFindViewById6 != null) {
                viewFindViewById3.setNextFocusRightId(viewFindViewById6.getId());
                viewFindViewById6.setNextFocusLeftId(viewFindViewById3.getId());
            }
            if (viewFindViewById6 != null && viewFindViewById4 != null) {
                viewFindViewById6.setNextFocusRightId(viewFindViewById4.getId());
                viewFindViewById4.setNextFocusLeftId(viewFindViewById6.getId());
            }
            if (viewFindViewById4 != null) {
                viewFindViewById4.setNextFocusRightId(this.R.getId());
                this.R.setNextFocusLeftId(viewFindViewById4.getId());
            }
        }
        if (viewFindViewById7 != null) {
            boolean z6 = zH && this.Y && !this.X;
            viewFindViewById7.setFocusable(z6 || (zH && this.X && z2));
            viewFindViewById7.setFocusableInTouchMode(false);
            if (this.X && !z2) {
                z = false;
            }
            viewFindViewById7.setEnabled(z);
            viewFindViewById7.setAlpha((!this.X || z2) ? f : 0.45f);
            if (z6) {
                viewFindViewById7.setContentDescription("Barra de progreso. Izquierda y derecha desplazan la reproducción");
                int id = viewFindViewById7.getId();
                ImageButton imageButton2 = this.Q;
                if (imageButton2 != null) {
                    imageButton2.setNextFocusUpId(id);
                }
                if (viewFindViewById3 != null) {
                    viewFindViewById3.setNextFocusUpId(id);
                }
                if (viewFindViewById6 != null) {
                    viewFindViewById6.setNextFocusUpId(id);
                }
                if (viewFindViewById4 != null) {
                    viewFindViewById4.setNextFocusUpId(id);
                }
                ImageButton imageButton3 = this.R;
                if (imageButton3 != null) {
                    imageButton3.setNextFocusUpId(id);
                }
                if (viewFindViewById5 != null) {
                    viewFindViewById7.setNextFocusDownId(viewFindViewById5.getId());
                    viewFindViewById5.setNextFocusUpId(id);
                } else if (viewFindViewById6 != null) {
                    viewFindViewById7.setNextFocusDownId(viewFindViewById6.getId());
                }
            } else {
                viewFindViewById7.setContentDescription(z2 ? "Barra DVR. Izquierda y derecha mueven 5 minutos " : "Canal en vivo sin DVR");
            }
            if ((viewFindViewById7 instanceof C1448uf) && this.X) {
                ((C1448uf) viewFindViewById7).setKeyTimeIncrement(300000L);
            }
        }
    }

    public final boolean H() {
        UiModeManager uiModeManager = (UiModeManager) getSystemService("uimode");
        return (uiModeManager != null && uiModeManager.getCurrentModeType() == 4) || getPackageManager().hasSystemFeature("android.software.leanback") || getPackageManager().hasSystemFeature("android.hardware.type.television");
    }

    /* JADX WARN: Removed duplicated region for block: B:37:0x00c5  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void K(final C0806i9 c0806i9, final long j) {
        boolean z;
        String str = c0806i9.e;
        String strTrim = str == null ? "" : str.trim();
        if (!strTrim.regionMatches(true, 0, "cochi-private://", 0, 16)) {
            Locale locale = Locale.ROOT;
            String lowerCase = strTrim.toLowerCase(locale);
            if (!lowerCase.startsWith("https://githab.com/") || !lowerCase.contains("/releases/download/")) {
                String str2 = c0806i9.e;
                if (this.Z == P8.i && str2 != null && str2.startsWith("cochi://resolve/tv2/")) {
                    String strTrim2 = str2.substring(20).trim();
                    int i = this.a0 + 1;
                    this.a0 = i;
                    this.H.setVisibility(0);
                    V(c0806i9);
                    new Thread(new RunnableC0742gy(this, strTrim2, i, c0806i9, j), "cochi-tv2-resolve").start();
                    return;
                }
                String str3 = c0806i9.d;
                String str4 = c0806i9.e;
                if ("youtube".equalsIgnoreCase(str3)) {
                    z = true;
                } else {
                    if (str4 != null) {
                        String lowerCase2 = str4.toLowerCase(locale);
                        if (lowerCase2.contains("youtube.com/") || lowerCase2.contains("youtu.be/")) {
                        }
                    }
                    z = false;
                }
                this.f0++;
                A();
                Handler handler = this.U;
                handler.removeCallbacks(this.V);
                handler.removeCallbacks(this.v0);
                handler.removeCallbacks(this.w0);
                handler.removeCallbacks(this.x0);
                handler.removeCallbacks(this.n0);
                this.d0 = 0;
                this.e0 = 0L;
                this.j0 = false;
                this.k0 = false;
                this.l0 = false;
                B();
                View view = this.P;
                if (view != null) {
                    view.setVisibility(8);
                }
                ImageButton imageButton = this.S;
                if (imageButton != null) {
                    imageButton.setVisibility(8);
                }
                this.H.setVisibility(0);
                C1089nj c1089nj = this.E;
                if (c1089nj != null) {
                    if (z) {
                        this.F.setPlayer(null);
                        this.E.O();
                        this.E = null;
                    } else {
                        try {
                            c1089nj.c0();
                            c1089nj.X(null);
                            C1481vB c1481vB = C1481vB.l;
                            long j2 = c1089nj.n0.s;
                            c1089nj.d0 = new C0314Vc(c1481vB);
                            this.E.a();
                        } catch (Exception unused) {
                        }
                    }
                }
                WebView webView = this.G;
                if (webView != null && webView.getVisibility() == 0) {
                    this.G.stopLoading();
                    this.G.loadUrl("about:blank");
                    this.G.clearHistory();
                    this.G.onPause();
                    this.G.setVisibility(8);
                }
                this.g0 = c0806i9;
                V(c0806i9);
                if (!c0806i9.f.trim().isEmpty()) {
                    O(c0806i9, j);
                    return;
                }
                if (!z) {
                    N(c0806i9, j);
                    return;
                }
                String strL = AbstractC1259qx.L(str4);
                if (strL == null || strL.isEmpty()) {
                    Toast.makeText(this, "No pude identificar el video de YouTube", 1).show();
                    return;
                }
                this.H.setVisibility(8);
                this.F.setVisibility(8);
                this.G.stopLoading();
                this.G.onResume();
                this.G.resumeTimers();
                this.G.setVisibility(0);
                WebSettings settings = this.G.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setMediaPlaybackRequiresUserGesture(false);
                this.G.setWebChromeClient(new WebChromeClient());
                this.G.setWebViewClient(new WebViewClient());
                this.G.loadDataWithBaseURL("https://com.cochi.client/", "<!doctype html><html><head><meta name='viewport' content='width=device-width,height=device-height,initial-scale=1,maximum-scale=1,user-scalable=no'><meta name='referrer' content='strict-origin-when-cross-origin'><style>html,body{margin:0;background:#000;width:100%;height:100%;overflow:hidden}iframe{width:100%;height:100%;border:0}</style></head><body><iframe src='https://www.youtube.com/embed/" + strL + "?autoplay=1&playsinline=1&origin=https%3A%2F%2Fcom.cochi.client' allow='autoplay; encrypted-media; picture-in-picture' allowfullscreen></iframe></body></html>", "text/html", "UTF-8", null);
                return;
            }
        }
        if (str == null || str.trim().isEmpty()) {
            return;
        }
        final int i2 = this.b0 + 1;
        this.b0 = i2;
        this.H.setVisibility(0);
        V(c0806i9);
        new Thread(new Runnable() { // from class: x.jy
            @Override // java.lang.Runnable
            public final void run() {
                C0806i9 c0806i92 = c0806i9;
                int i3 = i2;
                long j3 = j;
                PlayerActivity playerActivity = this.h;
                Handler handler2 = playerActivity.U;
                try {
                    handler2.post(new RunnableC0742gy(playerActivity, i3, c0806i92, AbstractC0431ax.c0(playerActivity.getApplicationContext(), c0806i92.e), j3, 1));
                } catch (Exception e) {
                    handler2.post(new RunnableC0517cg(playerActivity, i3, e, 4));
                }
            }
        }, "cochi-private-media-resolve").start();
    }

    public final void L(int i, long j) {
        if (this.Z == P8.k) {
            c0(true, new RunnableC0690fy(this, i, j, 2));
        } else {
            M(i, j);
        }
    }

    public final void M(int i, long j) {
        C0760hF c0760hF;
        int iD = AbstractC1116o9.d();
        if (iD == 0) {
            String stringExtra = getIntent().getStringExtra("cochi.extra.URL");
            if (stringExtra == null || stringExtra.trim().isEmpty()) {
                Toast.makeText(this, "Canal temporalmente no disponible", 0).show();
                return;
            }
            String stringExtra2 = getIntent().getStringExtra("cochi.extra.STREAM_TYPE");
            String stringExtra3 = getIntent().getStringExtra("cochi.extra.DISPLAY_NAME");
            String stringExtra4 = getIntent().getStringExtra("cochi.extra.CLEARKEY_MULTI");
            String stringExtra5 = getIntent().getStringExtra("cochi.extra.HEADERS_JSON");
            LinkedHashMap linkedHashMap = new LinkedHashMap();
            if (stringExtra5 != null && !stringExtra5.trim().isEmpty()) {
                try {
                    JSONObject jSONObject = new JSONObject(stringExtra5);
                    Iterator<String> itKeys = jSONObject.keys();
                    while (itKeys.hasNext()) {
                        String next = itKeys.next();
                        String strOptString = jSONObject.optString(next, "");
                        if (!next.trim().isEmpty() && !strOptString.trim().isEmpty()) {
                            linkedHashMap.put(next, strOptString);
                        }
                    }
                } catch (Exception unused) {
                }
            }
            if (stringExtra3 == null) {
                stringExtra3 = "Canal";
            }
            String str = stringExtra3;
            if (stringExtra2 == null) {
                stringExtra2 = "auto";
            }
            C0806i9 c0806i9 = new C0806i9("tv-snapshot", str, stringExtra2, stringExtra, stringExtra4 == null ? "" : stringExtra4, linkedHashMap);
            this.c0 = 0;
            K(c0806i9, 0L);
            return;
        }
        if (i < 0) {
            i = iD - 1;
        }
        if (i >= iD) {
            i = 0;
        }
        this.c0 = i;
        this.r0 = false;
        C0806i9 c0806i9A = AbstractC1116o9.a(i);
        if (c0806i9A == null) {
            return;
        }
        if (this.Z == P8.k) {
            String str2 = c0806i9A.a;
            Map map = AbstractC0966lF.a;
            synchronized (AbstractC0966lF.class) {
                if (str2 != null) {
                    Iterator it = AbstractC0966lF.a.values().iterator();
                    loop1: while (true) {
                        if (!it.hasNext()) {
                            c0760hF = new C0760hF(null, null, -1L);
                            break;
                        }
                        C0914kF c0914kF = (C0914kF) it.next();
                        for (C0812iF c0812iF : c0914kF.j) {
                            for (C0806i9 c0806i92 : c0812iF.c) {
                                if (str2.equals(c0806i92.a)) {
                                    c0760hF = c0914kF.k.K(c0812iF.a, c0806i92.b);
                                    break loop1;
                                }
                            }
                        }
                    }
                } else {
                    c0760hF = new C0760hF(null, null, -1L);
                }
            }
        } else {
            c0760hF = new C0760hF(null, null, -1L);
        }
        this.T = c0760hF;
        E();
        K(c0806i9A, j);
    }

    public final void N(C0806i9 c0806i9, long j) {
        this.G.setVisibility(8);
        this.F.setVisibility(0);
        C0619ef c0619ef = new C0619ef(x(c0806i9, c0806i9 == null ? "" : c0806i9.e));
        c0619ef.i(new C1725zw(this.X ? 1 : 4));
        C1089nj c1089nj = this.E;
        if (c1089nj == null) {
            this.E = z(c0619ef);
            v();
        } else {
            this.F.setPlayer(c1089nj);
        }
        C1089nj c1089nj2 = this.E;
        Y5 y5D = c0619ef.d(y(c0806i9, c0806i9.e));
        c1089nj2.c0();
        List listSingletonList = Collections.singletonList(y5D);
        c1089nj2.c0();
        c1089nj2.S(listSingletonList);
        if (j > 0) {
            this.E.k(5, j);
        }
        this.E.N();
        this.E.i();
        u();
        t();
    }

    public final void O(final C0806i9 c0806i9, long j) {
        String str;
        this.G.setVisibility(8);
        String str2 = c0806i9.e;
        if (c0806i9.m) {
            try {
                str = (String) this.W.submit(new Callable() { // from class: x.oy
                    @Override // java.util.concurrent.Callable
                    public final Object call() {
                        long[] jArr = PlayerActivity.z0;
                        this.a.getClass();
                        C0806i9 c0806i92 = c0806i9;
                        String str3 = c0806i92.p;
                        String str4 = c0806i92.n;
                        String str5 = c0806i92.o;
                        String strReplace = (str3 == null ? "" : str3.trim()).replace("{codigo}", str5 == null ? "" : str5.trim()).replace("{nombre}", str4 != null ? str4.trim() : "");
                        if (strReplace.startsWith("{token}")) {
                            strReplace = "https://chromecast.cvattv.com.ar" + strReplace.substring(7).replace("SA_Live_dash_enc", "SA_Live_dash_cenc");
                        }
                        return MotorPrivado.resolveGeneratedVideoUrl(strReplace, str4, str5, c0806i92.p);
                    }
                }).get(20L, TimeUnit.SECONDS);
            } catch (Exception unused) {
                str = null;
            }
            if (str != null) {
                str2 = str;
            }
        }
        this.F.setVisibility(0);
        try {
            ArrayList arrayList = new ArrayList(J(c0806i9.f));
            C1725zw c1725zw = new C1725zw(-1);
            UUID uuid = AbstractC1425u7.c;
            uuid.getClass();
            C1447ue c1447ue = new C1447ue(uuid, new C0336Wk(this, arrayList, new C1044mq(w(arrayList).getBytes(StandardCharsets.UTF_8))), new HashMap(), true, new int[0], true, c1725zw);
            C0619ef c0619ef = new C0619ef(x(c0806i9, str2));
            c0619ef.i(new C1725zw(this.X ? 1 : 4));
            c0619ef.h(new C0802i5(23, c1447ue));
            C1089nj c1089nj = this.E;
            if (c1089nj == null) {
                this.E = z(c0619ef);
                v();
            } else {
                this.F.setPlayer(c1089nj);
            }
            C1089nj c1089nj2 = this.E;
            Y5 y5D = c0619ef.d(y(c0806i9, str2));
            c1089nj2.c0();
            List listSingletonList = Collections.singletonList(y5D);
            c1089nj2.c0();
            c1089nj2.S(listSingletonList);
            if (j > 0) {
                this.E.k(5, j);
            }
            this.E.N();
            this.E.i();
            u();
            t();
        } catch (IllegalArgumentException e) {
            Toast.makeText(this, e.getMessage(), 1).show();
        }
    }

    public final void P(int i) {
        if (!this.Y || this.X) {
            return;
        }
        int i2 = this.c0 + i;
        if (i2 >= 0 && i2 < AbstractC1116o9.d()) {
            S();
            L(i2, 0L);
            this.U.post(new RunnableC0586dy(this, 1));
        } else {
            P8 p8 = this.Z;
            String str = p8 == P8.k ? "capítulo" : p8 == P8.j ? "película" : "contenido";
            Toast.makeText(this, i < 0 ? AbstractC0863jG.l("No hay ", str, " anterior") : AbstractC0863jG.l("No hay ", str, " siguiente"), 0).show();
            F();
            a0();
        }
    }

    public final boolean Q() {
        int iE;
        return (this.E == null || isFinishing() || isDestroyed() || (iE = this.E.E()) == 3 || iE == 4) ? false : true;
    }

    public final void R() throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        RunnableC0586dy runnableC0586dy = this.V;
        Handler handler = this.U;
        handler.removeCallbacks(runnableC0586dy);
        handler.removeCallbacks(this.v0);
        handler.removeCallbacks(this.w0);
        handler.removeCallbacks(this.x0);
        handler.removeCallbacks(this.y0);
        handler.removeCallbacks(this.n0);
        A();
        B();
        this.f0++;
        this.g0 = null;
        this.j0 = false;
        this.k0 = false;
        this.l0 = false;
        this.d0 = 0;
        this.e0 = 0L;
        View view = this.P;
        if (view != null) {
            view.setVisibility(8);
        }
        this.H.setVisibility(8);
        if (this.E != null) {
            this.F.setPlayer(null);
            this.E.O();
            this.E = null;
        }
        WebView webView = this.G;
        if (webView != null) {
            webView.stopLoading();
            this.G.loadUrl("about:blank");
            this.G.clearHistory();
            this.G.onPause();
            this.G.setVisibility(8);
        }
    }

    public final void S() {
        C0806i9 c0806i9A;
        P8 p8;
        C0914kF c0914kFB;
        ArrayList arrayList;
        int i;
        if (!U() || this.E == null || (c0806i9A = AbstractC1116o9.a(this.c0)) == null) {
            return;
        }
        long jC = this.E.C();
        long jX = this.E.x();
        if (jC <= 0 || jC == -9223372036854775807L || (p8 = this.Z) == null) {
            return;
        }
        String str = c0806i9A.a;
        P8 p82 = P8.j;
        P8 p83 = P8.k;
        if ((p8 == p82 || p8 == p83) && jC > 0 && jX >= 10000) {
            if (p8 == p83 && (c0914kFB = AbstractC0966lF.b(str)) != null) {
                SharedPreferences sharedPreferencesT = E5.T(this);
                ArrayList arrayListA = c0914kFB.a();
                int size = arrayListA.size();
                SharedPreferences.Editor editorEdit = null;
                int i2 = 0;
                while (i2 < size) {
                    Object obj = arrayListA.get(i2);
                    i2++;
                    C0806i9 c0806i9 = (C0806i9) obj;
                    if (c0806i9 != null) {
                        String str2 = c0806i9.a;
                        arrayList = arrayListA;
                        i = size;
                        if (!E5.a0(str2).equals(E5.a0(str))) {
                            String strC = E5.C(p83, str2);
                            if (sharedPreferencesT.contains(strC)) {
                                if (editorEdit == null) {
                                    editorEdit = sharedPreferencesT.edit();
                                }
                                editorEdit.remove(strC);
                            }
                        }
                    } else {
                        arrayList = arrayListA;
                        i = size;
                    }
                    arrayListA = arrayList;
                    size = i;
                }
                if (editorEdit != null) {
                    editorEdit.apply();
                }
            }
            boolean z = ((double) jX) / ((double) jC) >= 0.95d;
            if (z) {
                E5.G(this, p8, str);
                if (p8 == p82) {
                    E5.Y(this, p8, str);
                    return;
                }
            } else if (str != null) {
                E5.T(this).edit().remove(E5.e0(p8, str)).apply();
            }
            try {
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("source", p8.name());
                jSONObject.put("itemId", E5.a0(str));
                jSONObject.put("name", E5.a0(c0806i9A.c));
                jSONObject.put("logo", E5.a0(c0806i9A.k));
                if (z) {
                    jX = jC;
                }
                jSONObject.put("positionMs", jX);
                jSONObject.put("durationMs", jC);
                jSONObject.put("updatedAt", System.currentTimeMillis());
                E5.T(this).edit().putString(E5.C(p8, str), jSONObject.toString()).apply();
            } catch (Exception unused) {
            }
        }
    }

    public final void T(long j) {
        C1089nj c1089nj = this.E;
        if (c1089nj == null) {
            return;
        }
        if (!c1089nj.g()) {
            Toast.makeText(this, "Este canal no permite desplazamiento DVR", 0).show();
            return;
        }
        long jMax = Math.max(0L, this.E.x());
        long jC = this.E.C();
        long j2 = jMax + j;
        if (j < 0) {
            this.E.k(5, Math.max(0L, j2));
        } else if (jC == -9223372036854775807L || jC <= 0) {
            this.E.k(5, Math.max(0L, j2));
        } else {
            if (j2 >= jC - 1500 && this.E.f()) {
                C1089nj c1089nj2 = this.E;
                c1089nj2.getClass();
                c1089nj2.j(c1089nj2.v(), -9223372036854775807L, false);
                this.E.i();
                Toast.makeText(this, "EN VIVO", 0).show();
                return;
            }
            this.E.k(5, Math.min(j2, jC));
        }
        Toast.makeText(this, j < 0 ? "−5 min " : "+5 min ", 0).show();
    }

    public final boolean U() {
        P8 p8;
        if (!this.Y || (p8 = this.Z) == null) {
            return false;
        }
        return p8 == P8.j || p8 == P8.k;
    }

    public final void V(C0806i9 c0806i9) {
        this.J.setText(String.format(Locale.US, "%03d", Integer.valueOf(c0806i9.b)));
        this.K.setText(c0806i9.c);
        this.I.setVisibility(0);
        Handler handler = this.U;
        RunnableC0586dy runnableC0586dy = this.V;
        handler.removeCallbacks(runnableC0586dy);
        handler.postDelayed(runnableC0586dy, 2700L);
    }

    public final void W() {
        C1089nj c1089nj = this.E;
        if (c1089nj == null) {
            Toast.makeText(this, "Ajustes disponibles durante la reproducción", 0).show();
            return;
        }
        final boolean z = this.X && c1089nj.f() && this.E.g();
        String[] strArr = z ? new String[]{"Volver a EN VIVO", "Calidad", "Audio", "Subtítulos"} : new String[]{"Calidad", "Audio", "Subtítulos"};
        C1056n1 title = new C1056n1(this).setTitle("Ajustes");
        DialogInterface.OnClickListener onClickListener = new DialogInterface.OnClickListener() { // from class: x.qy
            @Override // android.content.DialogInterface.OnClickListener
            public final void onClick(DialogInterface dialogInterface, int i) {
                long[] jArr = PlayerActivity.z0;
                PlayerActivity playerActivity = this.h;
                if (!z) {
                    if (i == 0) {
                        playerActivity.Y("Calidad", 2);
                        return;
                    } else if (i == 1) {
                        playerActivity.Y("Audio", 1);
                        return;
                    } else {
                        playerActivity.X();
                        return;
                    }
                }
                if (i != 0) {
                    if (i == 1) {
                        playerActivity.Y("Calidad", 2);
                        return;
                    } else if (i == 2) {
                        playerActivity.Y("Audio", 1);
                        return;
                    } else {
                        playerActivity.X();
                        return;
                    }
                }
                C1089nj c1089nj2 = playerActivity.E;
                if (c1089nj2 == null || !c1089nj2.f()) {
                    return;
                }
                C1089nj c1089nj3 = playerActivity.E;
                c1089nj3.getClass();
                c1089nj3.j(c1089nj3.v(), -9223372036854775807L, false);
                playerActivity.E.i();
                Toast.makeText(playerActivity, "EN VIVO", 0).show();
            }
        };
        C0848j1 c0848j1 = title.a;
        c0848j1.m = strArr;
        c0848j1.o = onClickListener;
        title.c();
    }

    public final void X() {
        C1089nj c1089nj = this.E;
        if (c1089nj == null) {
            return;
        }
        C0475bp c0475bpListIterator = c1089nj.A().a.listIterator(0);
        while (c0475bpListIterator.hasNext()) {
            C0609eK c0609eK = (C0609eK) c0475bpListIterator.next();
            if (c0609eK.b.c == 3 && c0609eK.a > 0) {
                C0515ce c0515ce = new C0515ce(this, "Subtítulos", this.E, 3);
                c0515ce.a = true;
                c0515ce.a().show();
                return;
            }
        }
        C1056n1 title = new C1056n1(this).setTitle("Subtítulos");
        title.a.f = "Subtítulos no disponibles para este contenido";
        title.b("Aceptar", null);
        title.c();
    }

    public final void Y(String str, int i) {
        C1089nj c1089nj = this.E;
        if (c1089nj == null) {
            return;
        }
        C0515ce c0515ce = new C0515ce(this, str, c1089nj, i);
        c0515ce.a = false;
        c0515ce.a().show();
    }

    public final void Z(W6 w6, String str) {
        C1089nj c1089nj = this.E;
        if (c1089nj == null || w6 == null) {
            return;
        }
        long j = w6.b;
        if (j > w6.a) {
            if (!c1089nj.g()) {
                Toast.makeText(this, "Este contenido no permite saltar", 0).show();
                return;
            }
            this.E.k(5, j);
            this.E.i();
            b0();
            Toast.makeText(this, str, 0).show();
        }
    }

    public final void a0() {
        boolean z;
        boolean z2;
        PlayerView playerView = this.F;
        if (playerView == null) {
            return;
        }
        Gy gy = playerView.s;
        boolean z3 = gy != null && gy.j();
        if (this.S != null) {
            if (H() || !z3) {
                this.S.setVisibility(8);
            } else {
                this.S.setVisibility(0);
                this.S.setEnabled(true);
                this.S.setClickable(true);
                this.S.setAlpha(1.0f);
                this.S.bringToFront();
            }
        }
        View view = this.P;
        if (view == null || (z = this.X) || !(z2 = this.Y)) {
            if (view != null) {
                view.setVisibility(8);
                return;
            }
            return;
        }
        if (!z3) {
            view.setVisibility(8);
            return;
        }
        if (!z && z2) {
            view.setVisibility(0);
            this.P.bringToFront();
            boolean z4 = this.c0 > 0 && AbstractC1116o9.d() > 0;
            int i = this.c0;
            boolean z5 = i >= 0 && i + 1 < AbstractC1116o9.d();
            boolean z6 = this.Z == P8.j;
            this.Q.setEnabled(z4);
            this.Q.setClickable(z4);
            this.Q.setAlpha(z4 ? 1.0f : 0.32f);
            this.Q.setVisibility(0);
            ImageButton imageButton = this.Q;
            P8 p8 = this.Z;
            P8 p82 = P8.k;
            imageButton.setContentDescription(p8 == p82 ? "Capítulo anterior" : z6 ? "Película anterior" : "Contenido anterior");
            this.R.setEnabled(z5);
            this.R.setClickable(z5);
            this.R.setAlpha(z5 ? 1.0f : 0.32f);
            this.R.setVisibility(0);
            this.R.setContentDescription(this.Z == p82 ? "Capítulo siguiente" : z6 ? "Película siguiente" : "Contenido siguiente");
        }
        ImageButton imageButton2 = this.S;
        if (imageButton2 == null || imageButton2.getVisibility() != 0) {
            return;
        }
        this.S.bringToFront();
    }

    /* JADX WARN: Removed duplicated region for block: B:18:0x003a  */
    /* JADX WARN: Removed duplicated region for block: B:28:0x0051  */
    /* JADX WARN: Removed duplicated region for block: B:36:0x0068  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void b0() {
        boolean z;
        boolean z2;
        boolean z3;
        if (this.E == null || this.Z != P8.k || this.T.a()) {
            E();
            return;
        }
        long jMax = Math.max(0L, this.E.x());
        C0760hF c0760hF = this.T;
        W6 w6 = c0760hF.a;
        int i = 0;
        if (w6 != null) {
            long j = w6.b;
            long j2 = w6.a;
            z = j > j2 && jMax >= j2 && jMax < j;
        }
        W6 w62 = c0760hF.b;
        if (w62 != null) {
            long j3 = w62.b;
            long j4 = w62.a;
            z2 = j3 > j4 && jMax >= j4 && jMax < j3;
        }
        if (this.c0 + 1 < AbstractC1116o9.d()) {
            long j5 = this.T.c;
            z3 = j5 >= 0 && jMax >= j5;
        }
        this.M.setVisibility(z ? 0 : 8);
        this.N.setVisibility(z2 ? 0 : 8);
        this.O.setVisibility(z3 ? 0 : 8);
        View view = this.L;
        if (!z && !z2 && !z3) {
            i = 8;
        }
        view.setVisibility(i);
    }

    public final void c0(boolean z, RunnableC0690fy runnableC0690fy) {
        if (this.Z != P8.k) {
            if (runnableC0690fy != null) {
                runnableC0690fy.run();
                return;
            }
            return;
        }
        if (this.t0) {
            return;
        }
        if (runnableC0690fy != null && AbstractC1070nF.o0()) {
            runnableC0690fy.run();
            return;
        }
        if (this.s0) {
            if (runnableC0690fy != null) {
                this.u0 = runnableC0690fy;
                return;
            }
            return;
        }
        boolean z2 = true;
        this.s0 = true;
        if (!z && runnableC0690fy == null) {
            z2 = false;
        }
        if (z2) {
            this.H.setVisibility(0);
        }
        new Thread(new RunnableC1052my(this, z2, runnableC0690fy, z), "cochi-series-player-access").start();
    }

    public final void d0(int i) {
        S();
        if (AbstractC1116o9.d() >= 2) {
            D();
            L(this.c0 + i, 0L);
            D();
        } else {
            C0806i9 c0806i9A = AbstractC1116o9.a(this.c0);
            if (c0806i9A != null) {
                V(c0806i9A);
            }
            D();
        }
    }

    @Override // x.W1, x.AbstractActivityC0326Wa, android.app.Activity, android.view.Window.Callback
    public final boolean dispatchKeyEvent(KeyEvent keyEvent) {
        Gy gy;
        if (this.X && keyEvent.getAction() == 0 && keyEvent.getRepeatCount() == 0) {
            int keyCode = keyEvent.getKeyCode();
            PlayerView playerView = this.F;
            boolean z = (playerView == null || (gy = playerView.s) == null || !gy.j()) ? false : true;
            if (keyCode == 166 || (keyCode == 19 && !z)) {
                d0(1);
                return true;
            }
            if (keyCode == 167 || (keyCode == 20 && !z)) {
                d0(-1);
                return true;
            }
            if (keyCode == 165) {
                C0806i9 c0806i9A = AbstractC1116o9.a(this.c0);
                if (c0806i9A != null) {
                    V(c0806i9A);
                }
                return true;
            }
            if (keyCode == 82) {
                W();
                return true;
            }
        }
        return super.dispatchKeyEvent(keyEvent);
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public final boolean dispatchTouchEvent(MotionEvent motionEvent) {
        boolean zDispatchTouchEvent = super.dispatchTouchEvent(motionEvent);
        if (motionEvent != null && motionEvent.getActionMasked() == 0 && this.Y && !this.X) {
            this.U.postDelayed(new RunnableC0586dy(this, 2), 80L);
        }
        return zDispatchTouchEvent;
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r0v23, types: [x.ky] */
    /* JADX WARN: Type inference failed for: r15v79, types: [x.ly] */
    @Override // x.W1, x.AbstractActivityC0340Xa, x.AbstractActivityC0326Wa, android.app.Activity
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_player);
        MotorPrivado.initialize(getApplicationContext());
        getWindow().addFlags(128);
        getWindow().addFlags(8192);
        this.F = (PlayerView) findViewById(R.id.playerView);
        this.G = (WebView) findViewById(R.id.youtubeWebView);
        this.H = (ProgressBar) findViewById(R.id.loading);
        this.I = findViewById(R.id.channelInfo);
        this.J = (TextView) findViewById(R.id.channelNumber);
        this.K = (TextView) findViewById(R.id.channelName);
        this.L = findViewById(R.id.episodeActions);
        this.M = (MaterialButton) findViewById(R.id.skipRecapButton);
        this.N = (MaterialButton) findViewById(R.id.skipIntroButton);
        this.O = (MaterialButton) findViewById(R.id.nextEpisodeButton);
        this.P = findViewById(R.id.cochiNavOverlay);
        this.Q = (ImageButton) findViewById(R.id.cochiPreviousButton);
        this.R = (ImageButton) findViewById(R.id.cochiNextButton);
        this.S = (ImageButton) findViewById(R.id.cochiSettingsButton);
        this.M.setOnClickListener(new ViewOnClickListenerC0638ey(this, 6));
        this.N.setOnClickListener(new ViewOnClickListenerC0638ey(this, 7));
        this.O.setOnClickListener(new ViewOnClickListenerC0638ey(this, 8));
        this.Q.setOnClickListener(new ViewOnClickListenerC0638ey(this, 9));
        this.R.setOnClickListener(new ViewOnClickListenerC0638ey(this, 10));
        final int i = 0;
        this.S.setOnClickListener(new ViewOnClickListenerC0638ey(this, i));
        this.P.setVisibility(8);
        this.X = getIntent().getBooleanExtra("cochi.extra.TV_MODE", false);
        this.Y = getIntent().getBooleanExtra("cochi.extra.STORE_ITEM", false);
        if (this.X) {
            this.F.setControllerAutoShow(false);
            this.F.e();
        }
        String stringExtra = getIntent().getStringExtra("cochi.extra.CATALOG_SOURCE");
        if (stringExtra != null) {
            try {
                this.Z = P8.valueOf(stringExtra);
            } catch (Exception unused) {
            }
        }
        this.o0 = getIntent().getBooleanExtra("cochi.extra.FORCE_START", false);
        this.p0 = getIntent().getBooleanExtra("cochi.extra.AUTO_RESUME", false);
        this.q0 = getIntent().getBooleanExtra("cochi.extra.AUTO_NEXT_SERIES", false);
        this.F.setControllerVisibilityListener(new C0802i5(22, this));
        Handler handler = this.U;
        RunnableC1311ry runnableC1311ry = this.x0;
        handler.removeCallbacks(runnableC1311ry);
        if (!H() || (this.Y && !this.X)) {
            handler.post(runnableC1311ry);
        }
        if (this.Z == P8.k) {
            RunnableC1311ry runnableC1311ry2 = this.y0;
            handler.removeCallbacks(runnableC1311ry2);
            handler.postDelayed(runnableC1311ry2, 30000L);
        }
        if (this.X || this.Y) {
            this.c0 = getIntent().getIntExtra("cochi.extra.CHANNEL_INDEX", 0);
            if (!U()) {
                L(this.c0, 0L);
                return;
            }
            C0806i9 c0806i9A = AbstractC1116o9.a(this.c0);
            final Cz czV = c0806i9A == null ? null : E5.v(this, this.Z, c0806i9A.a);
            if (this.o0) {
                L(this.c0, 0L);
                return;
            }
            if (this.p0 && czV != null) {
                long j = czV.e;
                if (j >= 10000) {
                    L(this.c0, j);
                    return;
                }
            }
            if (czV != null) {
                long j2 = czV.e;
                if (j2 >= 10000) {
                    C1056n1 title = new C1056n1(this).setTitle(czV.c);
                    StringBuilder sb = new StringBuilder("¿Querés continuar desde ");
                    long jMax = Math.max(0L, j2 / 1000);
                    long j3 = jMax / 3600;
                    long j4 = (jMax % 3600) / 60;
                    long j5 = jMax % 60;
                    final int i2 = 1;
                    title.a.f = AbstractC0863jG.m(sb, j3 > 0 ? String.format(Locale.US, "%d:%02d:%02d", Long.valueOf(j3), Long.valueOf(j4), Long.valueOf(j5)) : String.format(Locale.US, "%d:%02d", Long.valueOf(j4), Long.valueOf(j5)), "?");
                    title.a("Desde el inicio", new DialogInterface.OnClickListener(this) { // from class: x.ky
                        public final /* synthetic */ PlayerActivity i;

                        {
                            this.i = this;
                        }

                        @Override // android.content.DialogInterface.OnClickListener
                        public final void onClick(DialogInterface dialogInterface, int i3) {
                            switch (i) {
                                case 0:
                                    PlayerActivity playerActivity = this.i;
                                    E5.Y(playerActivity, playerActivity.Z, czV.b);
                                    playerActivity.L(playerActivity.c0, 0L);
                                    break;
                                default:
                                    PlayerActivity playerActivity2 = this.i;
                                    playerActivity2.L(playerActivity2.c0, czV.e);
                                    break;
                            }
                        }
                    });
                    title.b("Continuar", new DialogInterface.OnClickListener(this) { // from class: x.ky
                        public final /* synthetic */ PlayerActivity i;

                        {
                            this.i = this;
                        }

                        @Override // android.content.DialogInterface.OnClickListener
                        public final void onClick(DialogInterface dialogInterface, int i3) {
                            switch (i2) {
                                case 0:
                                    PlayerActivity playerActivity = this.i;
                                    E5.Y(playerActivity, playerActivity.Z, czV.b);
                                    playerActivity.L(playerActivity.c0, 0L);
                                    break;
                                default:
                                    PlayerActivity playerActivity2 = this.i;
                                    playerActivity2.L(playerActivity2.c0, czV.e);
                                    break;
                            }
                        }
                    });
                    title.a.k = new DialogInterface.OnCancelListener() { // from class: x.ly
                        @Override // android.content.DialogInterface.OnCancelListener
                        public final void onCancel(DialogInterface dialogInterface) {
                            long[] jArr = PlayerActivity.z0;
                            this.h.finish();
                        }
                    };
                    title.c();
                    return;
                }
            }
            L(this.c0, 0L);
            return;
        }
        String stringExtra2 = getIntent().getStringExtra("cochi.extra.URL");
        String stringExtra3 = getIntent().getStringExtra("cochi.extra.CLEARKEY_KID");
        String stringExtra4 = getIntent().getStringExtra("cochi.extra.CLEARKEY_KEY");
        String stringExtra5 = getIntent().getStringExtra("cochi.extra.CLEARKEY_MULTI");
        String stringExtra6 = getIntent().getStringExtra("cochi.extra.STREAM_TYPE");
        String stringExtra7 = getIntent().getStringExtra("cochi.extra.DISPLAY_NAME");
        String stringExtra8 = getIntent().getStringExtra("cochi.extra.HEADERS_JSON");
        if (stringExtra2 == null || stringExtra2.trim().isEmpty()) {
            finish();
            return;
        }
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        String str = "";
        if (stringExtra8 != null && !stringExtra8.trim().isEmpty()) {
            try {
                JSONObject jSONObject = new JSONObject(stringExtra8);
                Iterator<String> itKeys = jSONObject.keys();
                while (itKeys.hasNext()) {
                    String next = itKeys.next();
                    String strOptString = jSONObject.optString(next, "");
                    if (!next.trim().isEmpty() && !strOptString.trim().isEmpty()) {
                        linkedHashMap.put(next, strOptString);
                    }
                }
            } catch (Exception unused2) {
            }
        }
        String strTrim = (stringExtra7 == null || stringExtra7.trim().isEmpty()) ? "Reproducción" : stringExtra7.trim();
        String strTrim2 = (stringExtra6 == null || stringExtra6.trim().isEmpty()) ? "auto" : stringExtra6.trim();
        if (stringExtra5 != null && !stringExtra5.trim().isEmpty()) {
            str = stringExtra5;
        } else if (stringExtra3 != null && stringExtra4 != null) {
            str = stringExtra3 + ":" + stringExtra4;
        }
        K(new C0806i9("direct-search", strTrim, strTrim2, stringExtra2, str, linkedHashMap), 0L);
    }

    @Override // x.W1, android.app.Activity
    public final void onDestroy() throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        S();
        R();
        WebView webView = this.G;
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }

    @Override // x.W1, android.app.Activity
    public final void onStart() throws IllegalAccessException, NoSuchFieldException, PackageManager.NameNotFoundException, SecurityException, IllegalArgumentException {
        super.onStart();
        C1089nj c1089nj = this.E;
        if (c1089nj != null) {
            c1089nj.i();
            if (this.E.E() == 2) {
                t();
            }
        }
        WebView webView = this.G;
        if (webView != null) {
            webView.onResume();
        }
    }

    @Override // x.W1, android.app.Activity
    public final void onStop() throws IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException {
        S();
        A();
        this.U.removeCallbacks(this.n0);
        super.onStop();
        C1089nj c1089nj = this.E;
        if (c1089nj != null) {
            c1089nj.c0();
            c1089nj.Z(1, false);
        }
        WebView webView = this.G;
        if (webView != null) {
            webView.onPause();
        }
    }

    public final void s(View view) {
        if (view == null) {
            return;
        }
        view.setForeground(getDrawable(R.drawable.cochi_player_focus));
    }

    public final void t() {
        if (this.E == null || this.g0 == null || isFinishing() || isDestroyed() || this.j0 || this.h0 != null || this.i0 != null) {
            return;
        }
        int i = this.f0;
        boolean z = this.X;
        long j = z ? 1800L : 12000L;
        long j2 = z ? 6500L : 25000L;
        RunnableC0690fy runnableC0690fy = new RunnableC0690fy(this, i, j, 0);
        this.h0 = runnableC0690fy;
        this.i0 = new RunnableC0690fy(this, i, j2, 1);
        Handler handler = this.U;
        handler.postDelayed(runnableC0690fy, j);
        handler.postDelayed(this.i0, j2);
    }

    public final void u() {
        if (!this.X || this.g0 == null) {
            return;
        }
        B();
        RunnableC1422u4 runnableC1422u4 = new RunnableC1422u4(this.f0, 3, this);
        this.m0 = runnableC1422u4;
        this.U.postDelayed(runnableC1422u4, 9000L);
    }

    public final void v() throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        this.F.setPlayer(this.E);
        if (this.X) {
            D();
        }
        F();
        Handler handler = this.U;
        RunnableC1311ry runnableC1311ry = this.x0;
        handler.removeCallbacks(runnableC1311ry);
        if (!H() || (this.Y && !this.X)) {
            handler.post(runnableC1311ry);
        }
        C1089nj c1089nj = this.E;
        c1089nj.m.a(new C0839is(1, this));
    }

    public final C0139Je x(C0806i9 c0806i9, String str) {
        String strTrim;
        String str2 = null;
        Map map = c0806i9 == null ? null : c0806i9.g;
        Set set = AbstractC0192Mm.a;
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        AbstractC0192Mm.b(linkedHashMap, "Accept", "*/*");
        AbstractC0192Mm.b(linkedHashMap, "Accept-Language", "es-AR,es;q=0.9,en;q=0.7");
        AbstractC0192Mm.b(linkedHashMap, "User-Agent", "Mozilla/5.0 (Linux; Android 13; CO-CHI) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36 CO-CHI/0.22.14");
        String lowerCase = "";
        if (str == null) {
            strTrim = "";
        } else {
            try {
                strTrim = str.trim();
            } catch (Exception unused) {
            }
        }
        String host = URI.create(strTrim).getHost();
        if (host != null) {
            lowerCase = host.toLowerCase(Locale.ROOT);
        }
        C0177Lm c0177Lm = lowerCase.isEmpty() ? null : (C0177Lm) AbstractC0192Mm.b.get(lowerCase);
        if (c0177Lm != null) {
            synchronized (c0177Lm) {
                try {
                    for (C0162Km c0162Km : c0177Lm.a.values()) {
                        String strA = c0162Km.a();
                        if (strA != null) {
                            AbstractC0192Mm.b(linkedHashMap, c0162Km.a, strA);
                        }
                    }
                } finally {
                }
            }
        }
        if (map != null) {
            for (Map.Entry entry : map.entrySet()) {
                String str3 = (String) entry.getKey();
                String strTrim2 = str3 == null ? "" : str3.trim();
                String str4 = (String) entry.getValue();
                String strTrim3 = str4 == null ? "" : str4.trim();
                if (!strTrim2.isEmpty() && !strTrim3.isEmpty()) {
                    AbstractC0192Mm.b(linkedHashMap, strTrim2, strTrim3);
                }
            }
        }
        LinkedHashMap linkedHashMap2 = new LinkedHashMap(Collections.unmodifiableMap(linkedHashMap));
        ArrayList arrayList = new ArrayList(linkedHashMap2.keySet());
        int size = arrayList.size();
        int i = 0;
        while (true) {
            if (i >= size) {
                break;
            }
            Object obj = arrayList.get(i);
            i++;
            String str5 = (String) obj;
            if (str5.equalsIgnoreCase("User-Agent")) {
                str2 = (String) linkedHashMap2.remove(str5);
                break;
            }
        }
        if (str2 == null || str2.trim().isEmpty()) {
            str2 = "CO-CHI/0.23.93";
        }
        boolean z = this.X;
        int i2 = z ? 2500 : 7000;
        int i3 = z ? 4500 : 12000;
        C0139Je c0139Je = new C0139Je(0);
        c0139Je.h = i2;
        c0139Je.i = i3;
        c0139Je.j = true;
        c0139Je.l = str2;
        if (!linkedHashMap2.isEmpty()) {
            c0139Je.c(linkedHashMap2);
        }
        return c0139Je;
    }

    public final C1089nj z(C0619ef c0619ef) {
        HashMap map = new HashMap();
        map.put(Py.c.a, 144179200);
        C0413af.a(1000, 0, "bufferForPlaybackMs", "0");
        C0413af.a(5000, 0, "bufferForPlaybackAfterRebufferMs", "0");
        C0413af.a(20000, 1000, "minBufferMs", "bufferForPlaybackMs");
        C0413af.a(20000, 5000, "minBufferMs", "bufferForPlaybackAfterRebufferMs");
        C0413af.a(60000, 20000, "maxBufferMs", "minBufferMs");
        C0413af c0413af = new C0413af(new C0273Sd(), 20000, 20000, 60000, 60000, 5000, 5000, true, map);
        C0376Zi c0376Zi = new C0376Zi(this);
        QK.z(!c0376Zi.z);
        c0376Zi.d = new C1318s4(3, c0619ef);
        QK.z(!c0376Zi.z);
        c0376Zi.f = new C1318s4(2, c0413af);
        QK.z(!c0376Zi.z);
        c0376Zi.o = 10000L;
        QK.z(!c0376Zi.z);
        c0376Zi.p = 10000L;
        QK.z(!c0376Zi.z);
        c0376Zi.z = true;
        return new C1089nj(c0376Zi);
    }
}
