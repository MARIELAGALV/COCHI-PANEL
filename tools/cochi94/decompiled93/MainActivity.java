package com.cochi.client;

import android.app.UiModeManager;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.media3.ui.PlayerView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.cochi.client.ContinueWatchingActivity;
import com.cochi.client.MainActivity;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import org.json.JSONObject;
import x.A8;
import x.AbstractC0577dp;
import x.AbstractC0966lF;
import x.AbstractC1070nF;
import x.AbstractC1116o9;
import x.AbstractC1259qx;
import x.AbstractC1434uG;
import x.AbstractC1595xL;
import x.C0376Zi;
import x.C0475bp;
import x.C0580ds;
import x.C0806i9;
import x.C0839is;
import x.C0914kF;
import x.C0934kk;
import x.C1012m9;
import x.C1044mq;
import x.C1056n1;
import x.C1089nj;
import x.C1134oc;
import x.C1481vB;
import x.C8;
import x.Cz;
import x.DialogInterfaceC1108o1;
import x.E5;
import x.Ht;
import x.I8;
import x.InterfaceC0889jr;
import x.It;
import x.Jt;
import x.Kt;
import x.Lt;
import x.MH;
import x.NK;
import x.Nt;
import x.O8;
import x.P8;
import x.QK;
import x.Rt;
import x.RunnableC0478bs;
import x.RunnableC0747h2;
import x.RunnableC1112o5;
import x.S6;
import x.ViewOnFocusChangeListenerC0856j9;
import x.W1;
import x.X9;

/* loaded from: classes.dex */
public class MainActivity extends W1 {
    public static final /* synthetic */ int B0 = 0;
    public boolean A0;
    public View E;
    public TextView F;
    public TextView G;
    public TextView H;
    public TextView I;
    public boolean J;
    public C1012m9 K;
    public C1012m9 L;
    public C1012m9 M;
    public C1134oc N;
    public LinearLayout O;
    public LinearLayout P;
    public LinearLayout Q;
    public LinearLayout R;
    public ProgressBar S;
    public TextView T;
    public ImageView U;
    public PlayerView V;
    public WebView W;
    public View X;
    public C1089nj Y;
    public boolean Z;
    public JSONObject e0;
    public TextView i0;
    public TextView j0;
    public TextView k0;
    public TextView l0;
    public MaterialButton m0;
    public MaterialButton n0;
    public ScrollView o0;
    public NK p0;
    public int u0;
    public int v0;
    public int w0;
    public boolean x0;
    public int y0;
    public boolean z0;
    public final Handler a0 = new Handler(Looper.getMainLooper());
    public final ArrayList b0 = new ArrayList();
    public int c0 = 0;
    public int d0 = 8000;
    public final RunnableC1112o5 f0 = new RunnableC1112o5(11, this);
    public String g0 = "";
    public String h0 = "";
    public ArrayList q0 = new ArrayList();
    public ArrayList r0 = new ArrayList();
    public ArrayList s0 = new ArrayList();
    public ArrayList t0 = new ArrayList();

    public static String J(String str) {
        return (str == null || str.trim().isEmpty()) ? "General" : str.trim();
    }

    public static ArrayList O(P8 p8, ArrayList arrayList) {
        ArrayList arrayList2 = new ArrayList();
        int iMin = Math.min(16, arrayList.size());
        for (int i = 0; i < iMin; i++) {
            arrayList2.add(new NK(p8, (C0806i9) arrayList.get(i)));
        }
        return arrayList2;
    }

    public static void r(MainActivity mainActivity, boolean z) {
        if (z) {
            mainActivity.v0++;
        } else {
            mainActivity.w0++;
        }
        int iMax = Math.max(0, mainActivity.u0 - 1);
        mainActivity.u0 = iMax;
        if (iMax > 0) {
            return;
        }
        mainActivity.S.setVisibility(8);
        if (mainActivity.q0.isEmpty() && mainActivity.r0.isEmpty() && mainActivity.s0.isEmpty() && mainActivity.t0.isEmpty()) {
            mainActivity.T.setText("No se pudo cargar el contenido. Abrí una sección para reintentar.");
            mainActivity.T.setVisibility(0);
        }
        if (mainActivity.A0) {
            mainActivity.A0 = false;
            Toast.makeText(mainActivity, (mainActivity.w0 != 0 || mainActivity.v0 <= 0) ? mainActivity.v0 > 0 ? "Contenido actualizado parcialmente" : "No se pudo actualizar el contenido" : "Contenido actualizado", 0).show();
        }
    }

    public static ArrayList z(List list) {
        ArrayList arrayList = new ArrayList();
        if (list != null) {
            Iterator it = list.iterator();
            while (it.hasNext()) {
                C0806i9 c0806i9 = (C0806i9) it.next();
                if (c0806i9 != null && !c0806i9.i) {
                    arrayList.add(c0806i9);
                }
            }
        }
        return arrayList;
    }

    public final void A(NK nk) {
        if (nk == null || this.x0 || this.Z) {
            return;
        }
        P8 p8 = nk.a;
        int i = p8 == P8.k ? 3 : p8 == P8.j ? 2 : 1;
        if (this.p0 == null || i > this.y0) {
            this.y0 = i;
            u(nk);
        }
    }

    public final void B() {
        if (!AbstractC1434uG.b) {
            Toast.makeText(this, "Contenido bloqueado", 0).show();
            return;
        }
        final EditText editText = new EditText(this);
        editText.setHint("PIN de 4 dígitos");
        editText.setInputType(18);
        editText.setMaxLines(1);
        int iRound = Math.round(getResources().getDisplayMetrics().density * 20.0f);
        int i = iRound / 2;
        editText.setPadding(iRound, i, iRound, i);
        C1056n1 title = new C1056n1(this).setTitle("Acceso restringido");
        title.a.f = "Ingresá el PIN para acceder a esta sección.";
        C1056n1 view = title.setView(editText);
        view.a("Cancelar", null);
        view.b("Ingresar", null);
        final DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = view.create();
        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterface.OnShowListener() { // from class: x.gs
            @Override // android.content.DialogInterface.OnShowListener
            public final void onShow(DialogInterface dialogInterface) {
                int i2 = MainActivity.B0;
                final DialogInterfaceC1108o1 dialogInterfaceC1108o1 = dialogInterfaceC1108o1Create;
                Button buttonD = dialogInterfaceC1108o1.d(-1);
                final EditText editText2 = editText;
                final MainActivity mainActivity = this;
                buttonD.setOnClickListener(new View.OnClickListener() { // from class: x.es
                    @Override // android.view.View.OnClickListener
                    public final void onClick(View view2) {
                        int i3 = MainActivity.B0;
                        EditText editText3 = editText2;
                        String strTrim = editText3.getText().toString().trim();
                        if (strTrim.isEmpty()) {
                            editText3.setError("Ingresá el PIN");
                            return;
                        }
                        DialogInterfaceC1108o1 dialogInterfaceC1108o12 = dialogInterfaceC1108o1;
                        dialogInterfaceC1108o12.d(-1).setEnabled(false);
                        new Thread(new RunnableC0684fs(mainActivity, strTrim, dialogInterfaceC1108o12, editText3), "cochi-adult-pin").start();
                    }
                });
            }
        });
        dialogInterfaceC1108o1Create.show();
    }

    public final void C(P8 p8) {
        if (this.z0) {
            return;
        }
        this.z0 = true;
        Intent intent = new Intent(this, (Class<?>) CatalogActivity.class);
        intent.putExtra("cochi.extra.CATALOG_SOURCE", p8.name());
        startActivity(intent);
    }

    public final void D(NK nk) {
        if (nk != null) {
            P8 p8 = nk.a;
            C0806i9 c0806i9 = nk.b;
            if (c0806i9 == null) {
                return;
            }
            String str = c0806i9.a;
            P8 p82 = P8.k;
            if (p8 == p82) {
                C0914kF c0914kFC = AbstractC0966lF.c(str);
                if (c0914kFC == null || c0914kFC.b() == 0) {
                    C(p82);
                    return;
                }
                Intent intent = new Intent(this, (Class<?>) SeriesDetailActivity.class);
                intent.putExtra("cochi.extra.SERIES_DETAIL_ID", str);
                startActivity(intent);
                return;
            }
            P8 p83 = P8.j;
            P8 p84 = P8.i;
            ArrayList arrayList = p8 == p84 ? this.r0 : p8 == p83 ? this.s0 : p8 == p82 ? this.t0 : this.q0;
            int i = -1;
            if (arrayList != null && str != null) {
                int i2 = 0;
                while (true) {
                    if (i2 < arrayList.size()) {
                        C0806i9 c0806i92 = (C0806i9) arrayList.get(i2);
                        if (c0806i92 != null && str.equals(c0806i92.a)) {
                            i = i2;
                            break;
                        }
                        i2++;
                    } else {
                        break;
                    }
                }
            }
            if (i >= 0) {
                AbstractC1116o9.c(arrayList);
                Intent intent2 = new Intent(this, (Class<?>) PlayerActivity.class);
                intent2.putExtra("cochi.extra.STORE_ITEM", true);
                intent2.putExtra("cochi.extra.CHANNEL_INDEX", i);
                intent2.putExtra("cochi.extra.CATALOG_SOURCE", p8.name());
                startActivity(intent2);
                return;
            }
            if (p8 == P8.h || p8 == p84) {
                F(p8, false);
                return;
            }
            if (p8 != p82) {
                p82 = p83;
            }
            C(p82);
        }
    }

    public final void E(P8 p8, Runnable runnable) {
        if (AbstractC1434uG.c(p8)) {
            runnable.run();
        } else {
            Toast.makeText(this, "Contenido bloqueado", 0).show();
        }
    }

    public final void F(P8 p8, boolean z) {
        if (this.z0) {
            return;
        }
        this.z0 = true;
        Intent intent = new Intent(this, (Class<?>) TvActivity.class);
        intent.putExtra("cochi.extra.ADULT_ONLY", z);
        intent.putExtra("cochi.extra.SOURCE", p8.name());
        startActivity(intent);
    }

    /* JADX WARN: Removed duplicated region for block: B:9:0x001d  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void G() {
        int iMax;
        TextView textView;
        if (this.G == null || this.H == null) {
            return;
        }
        long j = AbstractC1070nF.W(this).getLong("expires_at_ms", 0L);
        int iMax2 = 0;
        if (j <= 0) {
            iMax = 0;
        } else {
            long jCurrentTimeMillis = j - System.currentTimeMillis();
            if (jCurrentTimeMillis > 0) {
                iMax = (int) Math.max(1L, jCurrentTimeMillis / TimeUnit.DAYS.toMillis(1L));
            }
        }
        if (this.J && (textView = this.I) != null) {
            textView.setText(String.valueOf(Math.max(0, iMax)));
            this.I.setContentDescription(Math.max(0, iMax) + " días restantes");
        }
        if (AbstractC1070nF.N(this)) {
            this.H.setText("CUENTA EXPIRADA");
            this.G.setText("Renová para continuar");
            return;
        }
        String strQ = AbstractC1070nF.q(this);
        String strConcat = strQ.isEmpty() ? "" : " · dispositivo ".concat(strQ);
        long j2 = AbstractC1070nF.W(this).getLong("expires_at_ms", 0L);
        long jMax = j2 <= 0 ? 0L : Math.max(0L, j2 - System.currentTimeMillis());
        if (jMax > 0 && jMax <= TimeUnit.HOURS.toMillis(2L)) {
            this.H.setText("DEMO ACTIVO");
            TextView textView2 = this.G;
            StringBuilder sb = new StringBuilder();
            long j3 = AbstractC1070nF.W(this).getLong("expires_at_ms", 0L);
            long jMax2 = j3 <= 0 ? 0L : Math.max(0L, j3 - System.currentTimeMillis());
            if (jMax2 > 0) {
                long millis = TimeUnit.MINUTES.toMillis(1L);
                iMax2 = (int) Math.max(1L, ((jMax2 + millis) - 1) / millis);
            }
            sb.append(iMax2);
            sb.append(" min restantes");
            sb.append(strConcat);
            textView2.setText(sb.toString());
        } else if (iMax <= 1) {
            this.H.setText("ATENCIÓN");
            this.G.setText("vence mañana" + strConcat);
        } else if (iMax <= 2) {
            this.H.setText("ATENCIÓN");
            this.G.setText("vence en " + iMax + " días" + strConcat);
        } else {
            this.H.setText("CUENTA ACTIVA");
            this.G.setText("vence en " + iMax + " días" + strConcat);
        }
        this.H.setTextColor(S6.A(this));
        this.G.setTextColor(getColor(R.color.cochi_text));
    }

    public final void H() {
        if (!this.J || this.N == null || this.O == null) {
            return;
        }
        ArrayList arrayListW = E5.w(this);
        C1134oc c1134oc = this.N;
        ArrayList arrayList = c1134oc.e;
        arrayList.clear();
        int iMin = Math.min(8, arrayListW.size());
        for (int i = 0; i < iMin; i++) {
            arrayList.add((Cz) arrayListW.get(i));
        }
        c1134oc.c();
        this.O.setVisibility(arrayListW.isEmpty() ? 8 : 0);
    }

    public final void I() {
        new Thread(new RunnableC0478bs(this, 0), "cochi-source-visibility").start();
    }

    public final void K(int i, View.OnClickListener onClickListener) throws IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException {
        View viewFindViewById = findViewById(i);
        if (viewFindViewById == null) {
            return;
        }
        viewFindViewById.setOnClickListener(onClickListener);
        viewFindViewById.setOnFocusChangeListener(new X9(3, this));
    }

    public final void L(int i, boolean z, View.OnClickListener onClickListener) throws IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException {
        View viewFindViewById = findViewById(i);
        if (viewFindViewById instanceof MaterialButton) {
            MaterialButton materialButton = (MaterialButton) viewFindViewById;
            materialButton.setOnClickListener(onClickListener);
            materialButton.setOnFocusChangeListener(new A8(this, materialButton, z));
        }
    }

    public final void M() {
        C1089nj c1089nj = this.Y;
        if (c1089nj != null) {
            try {
                c1089nj.O();
            } catch (Exception unused) {
            }
            this.Y = null;
        }
        PlayerView playerView = this.V;
        if (playerView != null) {
            playerView.setPlayer(null);
            this.V.setVisibility(8);
        }
        WebView webView = this.W;
        if (webView != null) {
            try {
                webView.stopLoading();
                this.W.loadUrl("about:blank");
                this.W.clearHistory();
                this.W.setVisibility(8);
            } catch (Exception unused2) {
            }
        }
    }

    public final void N() {
        ArrayList arrayList = new ArrayList();
        int iMax = Math.max(this.q0.size(), this.r0.size());
        for (int i = 0; i < iMax && arrayList.size() < 18; i++) {
            if (i < this.q0.size()) {
                arrayList.add(new NK(P8.h, (C0806i9) this.q0.get(i)));
            }
            if (arrayList.size() >= 18) {
                break;
            }
            if (i < this.r0.size()) {
                arrayList.add(new NK(P8.i, (C0806i9) this.r0.get(i)));
            }
        }
        this.K.l(arrayList);
        this.P.setVisibility(arrayList.isEmpty() ? 8 : 0);
        if (arrayList.isEmpty()) {
            return;
        }
        A((NK) arrayList.get(0));
    }

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
        if (AbstractC1070nF.N(this)) {
            Intent intent2 = new Intent(this, (Class<?>) ExpiredActivity.class);
            intent2.addFlags(335577088);
            startActivity(intent2);
            finish();
            return;
        }
        UiModeManager uiModeManager = (UiModeManager) getSystemService("uimode");
        final int i = 4;
        final int i2 = 0;
        final int i3 = 1;
        boolean z = (uiModeManager != null && uiModeManager.getCurrentModeType() == 4) || getPackageManager().hasSystemFeature("android.software.leanback");
        this.J = z;
        setContentView(z ? R.layout.activity_main_tv : R.layout.activity_main);
        if (this.J) {
            w();
        }
        ((TextView) findViewById(R.id.welcomeText)).setText(getSharedPreferences("cochi_session", 0).getString("client_name", "Cliente"));
        this.G = (TextView) findViewById(R.id.accountStatus);
        this.H = (TextView) findViewById(R.id.accountStatusTitle);
        this.I = (TextView) findViewById(R.id.expirationDaysBadge);
        G();
        final int i4 = 9;
        findViewById(R.id.logoutButton).setOnClickListener(new View.OnClickListener(this) { // from class: x.cs
            public final /* synthetic */ MainActivity i;

            {
                this.i = this;
            }

            /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
            /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
            /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
            /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
            /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
            @Override // android.view.View.OnClickListener
            /*
                Code decompiled incorrectly, please refer to instructions dump.
            */
            public final void onClick(View view) {
                P8 p8;
                P8 p82;
                int i5 = i4;
                P8 p83 = null;
                P8 p84 = P8.h;
                int i6 = 3;
                P8 p85 = P8.i;
                int i7 = 2;
                P8 p86 = P8.j;
                P8 p87 = P8.k;
                int i8 = 1;
                MainActivity mainActivity = this.i;
                switch (i5) {
                    case 0:
                        char c = 1;
                        if (!mainActivity.Z) {
                            NK nk = mainActivity.p0;
                            if (nk != null) {
                                P8 p88 = nk.a;
                                if (p88 != p84 && p88 != p85) {
                                    if (p88 == p87) {
                                        p86 = p87;
                                    }
                                    mainActivity.C(p86);
                                    break;
                                } else {
                                    mainActivity.F(p88, false);
                                    break;
                                }
                            } else {
                                mainActivity.C(p86);
                                break;
                            }
                        } else {
                            String str = mainActivity.g0;
                            str.getClass();
                            switch (str.hashCode()) {
                                case -1068259517:
                                    if (!str.equals("movies")) {
                                        c = 65535;
                                        break;
                                    } else {
                                        c = 0;
                                        break;
                                    }
                                case -905838985:
                                    if (!str.equals("series")) {
                                    }
                                    break;
                                case 115183:
                                    if (str.equals("tv1")) {
                                        c = 2;
                                        break;
                                    }
                                    break;
                                case 115184:
                                    if (str.equals("tv2")) {
                                        c = 3;
                                        break;
                                    }
                                    break;
                            }
                            switch (c) {
                                case 0:
                                    p83 = p86;
                                    break;
                                case 1:
                                    p83 = p87;
                                    break;
                                case 2:
                                    p83 = p84;
                                    break;
                                case 3:
                                    p83 = p85;
                                    break;
                            }
                            if (p83 != null) {
                                if (p83 != p84 && p83 != p85) {
                                    mainActivity.C(p83);
                                    break;
                                } else {
                                    mainActivity.F(p83, false);
                                    break;
                                }
                            }
                        }
                        break;
                    case 1:
                        ScrollView scrollView = mainActivity.o0;
                        if (scrollView != null) {
                            scrollView.smoothScrollTo(0, 0);
                            break;
                        }
                        break;
                    case 2:
                        int i9 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                        break;
                    case 3:
                        int i10 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                        break;
                    case 4:
                        int i11 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                        break;
                    case 5:
                        int i12 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                        break;
                    case 6:
                        if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                            mainActivity.A0 = true;
                            Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                            O8.i();
                            O8.h(mainActivity);
                            mainActivity.p0 = null;
                            mainActivity.x0 = false;
                            mainActivity.y0 = 0;
                            mainActivity.H();
                            mainActivity.I();
                            mainActivity.A0 = false;
                            break;
                        } else {
                            Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                            break;
                        }
                        break;
                    case 7:
                        int i13 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    case 8:
                        if (!mainActivity.Z) {
                            NK nk2 = mainActivity.p0;
                            if (nk2 != null) {
                                mainActivity.D(nk2);
                                break;
                            }
                        } else {
                            String str2 = mainActivity.g0;
                            str2.getClass();
                            switch (str2) {
                                case "movies":
                                    p8 = p86;
                                    break;
                                case "series":
                                    p8 = p87;
                                    break;
                                case "tv1":
                                    p8 = p84;
                                    break;
                                case "tv2":
                                    p8 = p85;
                                    break;
                                default:
                                    p8 = null;
                                    break;
                            }
                            if (p8 != null) {
                                if (!mainActivity.h0.isEmpty()) {
                                    ArrayList arrayList = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                    int size = arrayList.size();
                                    int i14 = 0;
                                    while (i14 < size) {
                                        Object obj = arrayList.get(i14);
                                        i14++;
                                        C0806i9 c0806i9 = (C0806i9) obj;
                                        if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                            mainActivity.D(new NK(p8, c0806i9));
                                            break;
                                        }
                                    }
                                }
                                String str3 = mainActivity.g0;
                                str3.getClass();
                                switch (str3) {
                                    case "movies":
                                        p82 = p86;
                                        break;
                                    case "series":
                                        p82 = p87;
                                        break;
                                    case "tv1":
                                        p82 = p84;
                                        break;
                                    case "tv2":
                                        p82 = p85;
                                        break;
                                    default:
                                        p82 = null;
                                        break;
                                }
                                if (p82 != null) {
                                    if (p82 != p84 && p82 != p85) {
                                        mainActivity.C(p82);
                                        break;
                                    } else {
                                        mainActivity.F(p82, false);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        int i15 = MainActivity.B0;
                        C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                        title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                        title.a("Cancelar", null);
                        title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i8));
                        DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i8));
                        dialogInterfaceC1108o1Create.show();
                        break;
                    case 10:
                        int i16 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                        break;
                    case 11:
                        int i17 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, i6));
                        break;
                    case 12:
                        int i18 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, i7));
                        break;
                    case 13:
                        int i19 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, i8));
                        break;
                    case 14:
                        int i20 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    default:
                        int i21 = MainActivity.B0;
                        mainActivity.getClass();
                        mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                        break;
                }
            }
        });
        if (!this.J) {
            ArrayList arrayList = O8.a;
            O8.x(getApplicationContext(), P8.k, new I8());
            final int i5 = 10;
            K(R.id.cardTv1, new View.OnClickListener(this) { // from class: x.cs
                public final /* synthetic */ MainActivity i;

                {
                    this.i = this;
                }

                /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
                /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
                /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
                /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
                /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
                @Override // android.view.View.OnClickListener
                /*
                    Code decompiled incorrectly, please refer to instructions dump.
                */
                public final void onClick(View view) {
                    P8 p8;
                    P8 p82;
                    int i52 = i5;
                    P8 p83 = null;
                    P8 p84 = P8.h;
                    int i6 = 3;
                    P8 p85 = P8.i;
                    int i7 = 2;
                    P8 p86 = P8.j;
                    P8 p87 = P8.k;
                    int i8 = 1;
                    MainActivity mainActivity = this.i;
                    switch (i52) {
                        case 0:
                            char c = 1;
                            if (!mainActivity.Z) {
                                NK nk = mainActivity.p0;
                                if (nk != null) {
                                    P8 p88 = nk.a;
                                    if (p88 != p84 && p88 != p85) {
                                        if (p88 == p87) {
                                            p86 = p87;
                                        }
                                        mainActivity.C(p86);
                                        break;
                                    } else {
                                        mainActivity.F(p88, false);
                                        break;
                                    }
                                } else {
                                    mainActivity.C(p86);
                                    break;
                                }
                            } else {
                                String str = mainActivity.g0;
                                str.getClass();
                                switch (str.hashCode()) {
                                    case -1068259517:
                                        if (!str.equals("movies")) {
                                            c = 65535;
                                            break;
                                        } else {
                                            c = 0;
                                            break;
                                        }
                                    case -905838985:
                                        if (!str.equals("series")) {
                                        }
                                        break;
                                    case 115183:
                                        if (str.equals("tv1")) {
                                            c = 2;
                                            break;
                                        }
                                        break;
                                    case 115184:
                                        if (str.equals("tv2")) {
                                            c = 3;
                                            break;
                                        }
                                        break;
                                }
                                switch (c) {
                                    case 0:
                                        p83 = p86;
                                        break;
                                    case 1:
                                        p83 = p87;
                                        break;
                                    case 2:
                                        p83 = p84;
                                        break;
                                    case 3:
                                        p83 = p85;
                                        break;
                                }
                                if (p83 != null) {
                                    if (p83 != p84 && p83 != p85) {
                                        mainActivity.C(p83);
                                        break;
                                    } else {
                                        mainActivity.F(p83, false);
                                        break;
                                    }
                                }
                            }
                            break;
                        case 1:
                            ScrollView scrollView = mainActivity.o0;
                            if (scrollView != null) {
                                scrollView.smoothScrollTo(0, 0);
                                break;
                            }
                            break;
                        case 2:
                            int i9 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                            break;
                        case 3:
                            int i10 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                            break;
                        case 4:
                            int i11 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                            break;
                        case 5:
                            int i12 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                            break;
                        case 6:
                            if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                                mainActivity.A0 = true;
                                Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                                O8.i();
                                O8.h(mainActivity);
                                mainActivity.p0 = null;
                                mainActivity.x0 = false;
                                mainActivity.y0 = 0;
                                mainActivity.H();
                                mainActivity.I();
                                mainActivity.A0 = false;
                                break;
                            } else {
                                Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                                break;
                            }
                            break;
                        case 7:
                            int i13 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        case 8:
                            if (!mainActivity.Z) {
                                NK nk2 = mainActivity.p0;
                                if (nk2 != null) {
                                    mainActivity.D(nk2);
                                    break;
                                }
                            } else {
                                String str2 = mainActivity.g0;
                                str2.getClass();
                                switch (str2) {
                                    case "movies":
                                        p8 = p86;
                                        break;
                                    case "series":
                                        p8 = p87;
                                        break;
                                    case "tv1":
                                        p8 = p84;
                                        break;
                                    case "tv2":
                                        p8 = p85;
                                        break;
                                    default:
                                        p8 = null;
                                        break;
                                }
                                if (p8 != null) {
                                    if (!mainActivity.h0.isEmpty()) {
                                        ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                        int size = arrayList2.size();
                                        int i14 = 0;
                                        while (i14 < size) {
                                            Object obj = arrayList2.get(i14);
                                            i14++;
                                            C0806i9 c0806i9 = (C0806i9) obj;
                                            if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                                mainActivity.D(new NK(p8, c0806i9));
                                                break;
                                            }
                                        }
                                    }
                                    String str3 = mainActivity.g0;
                                    str3.getClass();
                                    switch (str3) {
                                        case "movies":
                                            p82 = p86;
                                            break;
                                        case "series":
                                            p82 = p87;
                                            break;
                                        case "tv1":
                                            p82 = p84;
                                            break;
                                        case "tv2":
                                            p82 = p85;
                                            break;
                                        default:
                                            p82 = null;
                                            break;
                                    }
                                    if (p82 != null) {
                                        if (p82 != p84 && p82 != p85) {
                                            mainActivity.C(p82);
                                            break;
                                        } else {
                                            mainActivity.F(p82, false);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                        case 9:
                            int i15 = MainActivity.B0;
                            C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                            title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                            title.a("Cancelar", null);
                            title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i8));
                            DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                            dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i8));
                            dialogInterfaceC1108o1Create.show();
                            break;
                        case 10:
                            int i16 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                            break;
                        case 11:
                            int i17 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, i6));
                            break;
                        case 12:
                            int i18 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, i7));
                            break;
                        case 13:
                            int i19 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, i8));
                            break;
                        case 14:
                            int i20 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        default:
                            int i21 = MainActivity.B0;
                            mainActivity.getClass();
                            mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                            break;
                    }
                }
            });
            final int i6 = 11;
            K(R.id.cardTv2, new View.OnClickListener(this) { // from class: x.cs
                public final /* synthetic */ MainActivity i;

                {
                    this.i = this;
                }

                /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
                /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
                /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
                /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
                /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
                @Override // android.view.View.OnClickListener
                /*
                    Code decompiled incorrectly, please refer to instructions dump.
                */
                public final void onClick(View view) {
                    P8 p8;
                    P8 p82;
                    int i52 = i6;
                    P8 p83 = null;
                    P8 p84 = P8.h;
                    int i62 = 3;
                    P8 p85 = P8.i;
                    int i7 = 2;
                    P8 p86 = P8.j;
                    P8 p87 = P8.k;
                    int i8 = 1;
                    MainActivity mainActivity = this.i;
                    switch (i52) {
                        case 0:
                            char c = 1;
                            if (!mainActivity.Z) {
                                NK nk = mainActivity.p0;
                                if (nk != null) {
                                    P8 p88 = nk.a;
                                    if (p88 != p84 && p88 != p85) {
                                        if (p88 == p87) {
                                            p86 = p87;
                                        }
                                        mainActivity.C(p86);
                                        break;
                                    } else {
                                        mainActivity.F(p88, false);
                                        break;
                                    }
                                } else {
                                    mainActivity.C(p86);
                                    break;
                                }
                            } else {
                                String str = mainActivity.g0;
                                str.getClass();
                                switch (str.hashCode()) {
                                    case -1068259517:
                                        if (!str.equals("movies")) {
                                            c = 65535;
                                            break;
                                        } else {
                                            c = 0;
                                            break;
                                        }
                                    case -905838985:
                                        if (!str.equals("series")) {
                                        }
                                        break;
                                    case 115183:
                                        if (str.equals("tv1")) {
                                            c = 2;
                                            break;
                                        }
                                        break;
                                    case 115184:
                                        if (str.equals("tv2")) {
                                            c = 3;
                                            break;
                                        }
                                        break;
                                }
                                switch (c) {
                                    case 0:
                                        p83 = p86;
                                        break;
                                    case 1:
                                        p83 = p87;
                                        break;
                                    case 2:
                                        p83 = p84;
                                        break;
                                    case 3:
                                        p83 = p85;
                                        break;
                                }
                                if (p83 != null) {
                                    if (p83 != p84 && p83 != p85) {
                                        mainActivity.C(p83);
                                        break;
                                    } else {
                                        mainActivity.F(p83, false);
                                        break;
                                    }
                                }
                            }
                            break;
                        case 1:
                            ScrollView scrollView = mainActivity.o0;
                            if (scrollView != null) {
                                scrollView.smoothScrollTo(0, 0);
                                break;
                            }
                            break;
                        case 2:
                            int i9 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                            break;
                        case 3:
                            int i10 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                            break;
                        case 4:
                            int i11 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                            break;
                        case 5:
                            int i12 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                            break;
                        case 6:
                            if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                                mainActivity.A0 = true;
                                Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                                O8.i();
                                O8.h(mainActivity);
                                mainActivity.p0 = null;
                                mainActivity.x0 = false;
                                mainActivity.y0 = 0;
                                mainActivity.H();
                                mainActivity.I();
                                mainActivity.A0 = false;
                                break;
                            } else {
                                Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                                break;
                            }
                            break;
                        case 7:
                            int i13 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        case 8:
                            if (!mainActivity.Z) {
                                NK nk2 = mainActivity.p0;
                                if (nk2 != null) {
                                    mainActivity.D(nk2);
                                    break;
                                }
                            } else {
                                String str2 = mainActivity.g0;
                                str2.getClass();
                                switch (str2) {
                                    case "movies":
                                        p8 = p86;
                                        break;
                                    case "series":
                                        p8 = p87;
                                        break;
                                    case "tv1":
                                        p8 = p84;
                                        break;
                                    case "tv2":
                                        p8 = p85;
                                        break;
                                    default:
                                        p8 = null;
                                        break;
                                }
                                if (p8 != null) {
                                    if (!mainActivity.h0.isEmpty()) {
                                        ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                        int size = arrayList2.size();
                                        int i14 = 0;
                                        while (i14 < size) {
                                            Object obj = arrayList2.get(i14);
                                            i14++;
                                            C0806i9 c0806i9 = (C0806i9) obj;
                                            if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                                mainActivity.D(new NK(p8, c0806i9));
                                                break;
                                            }
                                        }
                                    }
                                    String str3 = mainActivity.g0;
                                    str3.getClass();
                                    switch (str3) {
                                        case "movies":
                                            p82 = p86;
                                            break;
                                        case "series":
                                            p82 = p87;
                                            break;
                                        case "tv1":
                                            p82 = p84;
                                            break;
                                        case "tv2":
                                            p82 = p85;
                                            break;
                                        default:
                                            p82 = null;
                                            break;
                                    }
                                    if (p82 != null) {
                                        if (p82 != p84 && p82 != p85) {
                                            mainActivity.C(p82);
                                            break;
                                        } else {
                                            mainActivity.F(p82, false);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                        case 9:
                            int i15 = MainActivity.B0;
                            C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                            title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                            title.a("Cancelar", null);
                            title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i8));
                            DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                            dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i8));
                            dialogInterfaceC1108o1Create.show();
                            break;
                        case 10:
                            int i16 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                            break;
                        case 11:
                            int i17 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                            break;
                        case 12:
                            int i18 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, i7));
                            break;
                        case 13:
                            int i19 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, i8));
                            break;
                        case 14:
                            int i20 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        default:
                            int i21 = MainActivity.B0;
                            mainActivity.getClass();
                            mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                            break;
                    }
                }
            });
            final int i7 = 12;
            K(R.id.cardMovies, new View.OnClickListener(this) { // from class: x.cs
                public final /* synthetic */ MainActivity i;

                {
                    this.i = this;
                }

                /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
                /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
                /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
                /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
                /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
                @Override // android.view.View.OnClickListener
                /*
                    Code decompiled incorrectly, please refer to instructions dump.
                */
                public final void onClick(View view) {
                    P8 p8;
                    P8 p82;
                    int i52 = i7;
                    P8 p83 = null;
                    P8 p84 = P8.h;
                    int i62 = 3;
                    P8 p85 = P8.i;
                    int i72 = 2;
                    P8 p86 = P8.j;
                    P8 p87 = P8.k;
                    int i8 = 1;
                    MainActivity mainActivity = this.i;
                    switch (i52) {
                        case 0:
                            char c = 1;
                            if (!mainActivity.Z) {
                                NK nk = mainActivity.p0;
                                if (nk != null) {
                                    P8 p88 = nk.a;
                                    if (p88 != p84 && p88 != p85) {
                                        if (p88 == p87) {
                                            p86 = p87;
                                        }
                                        mainActivity.C(p86);
                                        break;
                                    } else {
                                        mainActivity.F(p88, false);
                                        break;
                                    }
                                } else {
                                    mainActivity.C(p86);
                                    break;
                                }
                            } else {
                                String str = mainActivity.g0;
                                str.getClass();
                                switch (str.hashCode()) {
                                    case -1068259517:
                                        if (!str.equals("movies")) {
                                            c = 65535;
                                            break;
                                        } else {
                                            c = 0;
                                            break;
                                        }
                                    case -905838985:
                                        if (!str.equals("series")) {
                                        }
                                        break;
                                    case 115183:
                                        if (str.equals("tv1")) {
                                            c = 2;
                                            break;
                                        }
                                        break;
                                    case 115184:
                                        if (str.equals("tv2")) {
                                            c = 3;
                                            break;
                                        }
                                        break;
                                }
                                switch (c) {
                                    case 0:
                                        p83 = p86;
                                        break;
                                    case 1:
                                        p83 = p87;
                                        break;
                                    case 2:
                                        p83 = p84;
                                        break;
                                    case 3:
                                        p83 = p85;
                                        break;
                                }
                                if (p83 != null) {
                                    if (p83 != p84 && p83 != p85) {
                                        mainActivity.C(p83);
                                        break;
                                    } else {
                                        mainActivity.F(p83, false);
                                        break;
                                    }
                                }
                            }
                            break;
                        case 1:
                            ScrollView scrollView = mainActivity.o0;
                            if (scrollView != null) {
                                scrollView.smoothScrollTo(0, 0);
                                break;
                            }
                            break;
                        case 2:
                            int i9 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                            break;
                        case 3:
                            int i10 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                            break;
                        case 4:
                            int i11 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                            break;
                        case 5:
                            int i12 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                            break;
                        case 6:
                            if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                                mainActivity.A0 = true;
                                Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                                O8.i();
                                O8.h(mainActivity);
                                mainActivity.p0 = null;
                                mainActivity.x0 = false;
                                mainActivity.y0 = 0;
                                mainActivity.H();
                                mainActivity.I();
                                mainActivity.A0 = false;
                                break;
                            } else {
                                Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                                break;
                            }
                            break;
                        case 7:
                            int i13 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        case 8:
                            if (!mainActivity.Z) {
                                NK nk2 = mainActivity.p0;
                                if (nk2 != null) {
                                    mainActivity.D(nk2);
                                    break;
                                }
                            } else {
                                String str2 = mainActivity.g0;
                                str2.getClass();
                                switch (str2) {
                                    case "movies":
                                        p8 = p86;
                                        break;
                                    case "series":
                                        p8 = p87;
                                        break;
                                    case "tv1":
                                        p8 = p84;
                                        break;
                                    case "tv2":
                                        p8 = p85;
                                        break;
                                    default:
                                        p8 = null;
                                        break;
                                }
                                if (p8 != null) {
                                    if (!mainActivity.h0.isEmpty()) {
                                        ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                        int size = arrayList2.size();
                                        int i14 = 0;
                                        while (i14 < size) {
                                            Object obj = arrayList2.get(i14);
                                            i14++;
                                            C0806i9 c0806i9 = (C0806i9) obj;
                                            if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                                mainActivity.D(new NK(p8, c0806i9));
                                                break;
                                            }
                                        }
                                    }
                                    String str3 = mainActivity.g0;
                                    str3.getClass();
                                    switch (str3) {
                                        case "movies":
                                            p82 = p86;
                                            break;
                                        case "series":
                                            p82 = p87;
                                            break;
                                        case "tv1":
                                            p82 = p84;
                                            break;
                                        case "tv2":
                                            p82 = p85;
                                            break;
                                        default:
                                            p82 = null;
                                            break;
                                    }
                                    if (p82 != null) {
                                        if (p82 != p84 && p82 != p85) {
                                            mainActivity.C(p82);
                                            break;
                                        } else {
                                            mainActivity.F(p82, false);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                        case 9:
                            int i15 = MainActivity.B0;
                            C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                            title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                            title.a("Cancelar", null);
                            title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i8));
                            DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                            dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i8));
                            dialogInterfaceC1108o1Create.show();
                            break;
                        case 10:
                            int i16 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                            break;
                        case 11:
                            int i17 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                            break;
                        case 12:
                            int i18 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                            break;
                        case 13:
                            int i19 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, i8));
                            break;
                        case 14:
                            int i20 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        default:
                            int i21 = MainActivity.B0;
                            mainActivity.getClass();
                            mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                            break;
                    }
                }
            });
            final int i8 = 13;
            K(R.id.cardSeries, new View.OnClickListener(this) { // from class: x.cs
                public final /* synthetic */ MainActivity i;

                {
                    this.i = this;
                }

                /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
                /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
                /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
                /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
                /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
                @Override // android.view.View.OnClickListener
                /*
                    Code decompiled incorrectly, please refer to instructions dump.
                */
                public final void onClick(View view) {
                    P8 p8;
                    P8 p82;
                    int i52 = i8;
                    P8 p83 = null;
                    P8 p84 = P8.h;
                    int i62 = 3;
                    P8 p85 = P8.i;
                    int i72 = 2;
                    P8 p86 = P8.j;
                    P8 p87 = P8.k;
                    int i82 = 1;
                    MainActivity mainActivity = this.i;
                    switch (i52) {
                        case 0:
                            char c = 1;
                            if (!mainActivity.Z) {
                                NK nk = mainActivity.p0;
                                if (nk != null) {
                                    P8 p88 = nk.a;
                                    if (p88 != p84 && p88 != p85) {
                                        if (p88 == p87) {
                                            p86 = p87;
                                        }
                                        mainActivity.C(p86);
                                        break;
                                    } else {
                                        mainActivity.F(p88, false);
                                        break;
                                    }
                                } else {
                                    mainActivity.C(p86);
                                    break;
                                }
                            } else {
                                String str = mainActivity.g0;
                                str.getClass();
                                switch (str.hashCode()) {
                                    case -1068259517:
                                        if (!str.equals("movies")) {
                                            c = 65535;
                                            break;
                                        } else {
                                            c = 0;
                                            break;
                                        }
                                    case -905838985:
                                        if (!str.equals("series")) {
                                        }
                                        break;
                                    case 115183:
                                        if (str.equals("tv1")) {
                                            c = 2;
                                            break;
                                        }
                                        break;
                                    case 115184:
                                        if (str.equals("tv2")) {
                                            c = 3;
                                            break;
                                        }
                                        break;
                                }
                                switch (c) {
                                    case 0:
                                        p83 = p86;
                                        break;
                                    case 1:
                                        p83 = p87;
                                        break;
                                    case 2:
                                        p83 = p84;
                                        break;
                                    case 3:
                                        p83 = p85;
                                        break;
                                }
                                if (p83 != null) {
                                    if (p83 != p84 && p83 != p85) {
                                        mainActivity.C(p83);
                                        break;
                                    } else {
                                        mainActivity.F(p83, false);
                                        break;
                                    }
                                }
                            }
                            break;
                        case 1:
                            ScrollView scrollView = mainActivity.o0;
                            if (scrollView != null) {
                                scrollView.smoothScrollTo(0, 0);
                                break;
                            }
                            break;
                        case 2:
                            int i9 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                            break;
                        case 3:
                            int i10 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                            break;
                        case 4:
                            int i11 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                            break;
                        case 5:
                            int i12 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                            break;
                        case 6:
                            if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                                mainActivity.A0 = true;
                                Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                                O8.i();
                                O8.h(mainActivity);
                                mainActivity.p0 = null;
                                mainActivity.x0 = false;
                                mainActivity.y0 = 0;
                                mainActivity.H();
                                mainActivity.I();
                                mainActivity.A0 = false;
                                break;
                            } else {
                                Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                                break;
                            }
                            break;
                        case 7:
                            int i13 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        case 8:
                            if (!mainActivity.Z) {
                                NK nk2 = mainActivity.p0;
                                if (nk2 != null) {
                                    mainActivity.D(nk2);
                                    break;
                                }
                            } else {
                                String str2 = mainActivity.g0;
                                str2.getClass();
                                switch (str2) {
                                    case "movies":
                                        p8 = p86;
                                        break;
                                    case "series":
                                        p8 = p87;
                                        break;
                                    case "tv1":
                                        p8 = p84;
                                        break;
                                    case "tv2":
                                        p8 = p85;
                                        break;
                                    default:
                                        p8 = null;
                                        break;
                                }
                                if (p8 != null) {
                                    if (!mainActivity.h0.isEmpty()) {
                                        ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                        int size = arrayList2.size();
                                        int i14 = 0;
                                        while (i14 < size) {
                                            Object obj = arrayList2.get(i14);
                                            i14++;
                                            C0806i9 c0806i9 = (C0806i9) obj;
                                            if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                                mainActivity.D(new NK(p8, c0806i9));
                                                break;
                                            }
                                        }
                                    }
                                    String str3 = mainActivity.g0;
                                    str3.getClass();
                                    switch (str3) {
                                        case "movies":
                                            p82 = p86;
                                            break;
                                        case "series":
                                            p82 = p87;
                                            break;
                                        case "tv1":
                                            p82 = p84;
                                            break;
                                        case "tv2":
                                            p82 = p85;
                                            break;
                                        default:
                                            p82 = null;
                                            break;
                                    }
                                    if (p82 != null) {
                                        if (p82 != p84 && p82 != p85) {
                                            mainActivity.C(p82);
                                            break;
                                        } else {
                                            mainActivity.F(p82, false);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                        case 9:
                            int i15 = MainActivity.B0;
                            C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                            title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                            title.a("Cancelar", null);
                            title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                            DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                            dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                            dialogInterfaceC1108o1Create.show();
                            break;
                        case 10:
                            int i16 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                            break;
                        case 11:
                            int i17 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                            break;
                        case 12:
                            int i18 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                            break;
                        case 13:
                            int i19 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                            break;
                        case 14:
                            int i20 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        default:
                            int i21 = MainActivity.B0;
                            mainActivity.getClass();
                            mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                            break;
                    }
                }
            });
            final int i9 = 14;
            K(R.id.cardAdult, new View.OnClickListener(this) { // from class: x.cs
                public final /* synthetic */ MainActivity i;

                {
                    this.i = this;
                }

                /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
                /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
                /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
                /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
                /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
                @Override // android.view.View.OnClickListener
                /*
                    Code decompiled incorrectly, please refer to instructions dump.
                */
                public final void onClick(View view) {
                    P8 p8;
                    P8 p82;
                    int i52 = i9;
                    P8 p83 = null;
                    P8 p84 = P8.h;
                    int i62 = 3;
                    P8 p85 = P8.i;
                    int i72 = 2;
                    P8 p86 = P8.j;
                    P8 p87 = P8.k;
                    int i82 = 1;
                    MainActivity mainActivity = this.i;
                    switch (i52) {
                        case 0:
                            char c = 1;
                            if (!mainActivity.Z) {
                                NK nk = mainActivity.p0;
                                if (nk != null) {
                                    P8 p88 = nk.a;
                                    if (p88 != p84 && p88 != p85) {
                                        if (p88 == p87) {
                                            p86 = p87;
                                        }
                                        mainActivity.C(p86);
                                        break;
                                    } else {
                                        mainActivity.F(p88, false);
                                        break;
                                    }
                                } else {
                                    mainActivity.C(p86);
                                    break;
                                }
                            } else {
                                String str = mainActivity.g0;
                                str.getClass();
                                switch (str.hashCode()) {
                                    case -1068259517:
                                        if (!str.equals("movies")) {
                                            c = 65535;
                                            break;
                                        } else {
                                            c = 0;
                                            break;
                                        }
                                    case -905838985:
                                        if (!str.equals("series")) {
                                        }
                                        break;
                                    case 115183:
                                        if (str.equals("tv1")) {
                                            c = 2;
                                            break;
                                        }
                                        break;
                                    case 115184:
                                        if (str.equals("tv2")) {
                                            c = 3;
                                            break;
                                        }
                                        break;
                                }
                                switch (c) {
                                    case 0:
                                        p83 = p86;
                                        break;
                                    case 1:
                                        p83 = p87;
                                        break;
                                    case 2:
                                        p83 = p84;
                                        break;
                                    case 3:
                                        p83 = p85;
                                        break;
                                }
                                if (p83 != null) {
                                    if (p83 != p84 && p83 != p85) {
                                        mainActivity.C(p83);
                                        break;
                                    } else {
                                        mainActivity.F(p83, false);
                                        break;
                                    }
                                }
                            }
                            break;
                        case 1:
                            ScrollView scrollView = mainActivity.o0;
                            if (scrollView != null) {
                                scrollView.smoothScrollTo(0, 0);
                                break;
                            }
                            break;
                        case 2:
                            int i92 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                            break;
                        case 3:
                            int i10 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                            break;
                        case 4:
                            int i11 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                            break;
                        case 5:
                            int i12 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                            break;
                        case 6:
                            if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                                mainActivity.A0 = true;
                                Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                                O8.i();
                                O8.h(mainActivity);
                                mainActivity.p0 = null;
                                mainActivity.x0 = false;
                                mainActivity.y0 = 0;
                                mainActivity.H();
                                mainActivity.I();
                                mainActivity.A0 = false;
                                break;
                            } else {
                                Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                                break;
                            }
                            break;
                        case 7:
                            int i13 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        case 8:
                            if (!mainActivity.Z) {
                                NK nk2 = mainActivity.p0;
                                if (nk2 != null) {
                                    mainActivity.D(nk2);
                                    break;
                                }
                            } else {
                                String str2 = mainActivity.g0;
                                str2.getClass();
                                switch (str2) {
                                    case "movies":
                                        p8 = p86;
                                        break;
                                    case "series":
                                        p8 = p87;
                                        break;
                                    case "tv1":
                                        p8 = p84;
                                        break;
                                    case "tv2":
                                        p8 = p85;
                                        break;
                                    default:
                                        p8 = null;
                                        break;
                                }
                                if (p8 != null) {
                                    if (!mainActivity.h0.isEmpty()) {
                                        ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                        int size = arrayList2.size();
                                        int i14 = 0;
                                        while (i14 < size) {
                                            Object obj = arrayList2.get(i14);
                                            i14++;
                                            C0806i9 c0806i9 = (C0806i9) obj;
                                            if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                                mainActivity.D(new NK(p8, c0806i9));
                                                break;
                                            }
                                        }
                                    }
                                    String str3 = mainActivity.g0;
                                    str3.getClass();
                                    switch (str3) {
                                        case "movies":
                                            p82 = p86;
                                            break;
                                        case "series":
                                            p82 = p87;
                                            break;
                                        case "tv1":
                                            p82 = p84;
                                            break;
                                        case "tv2":
                                            p82 = p85;
                                            break;
                                        default:
                                            p82 = null;
                                            break;
                                    }
                                    if (p82 != null) {
                                        if (p82 != p84 && p82 != p85) {
                                            mainActivity.C(p82);
                                            break;
                                        } else {
                                            mainActivity.F(p82, false);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                        case 9:
                            int i15 = MainActivity.B0;
                            C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                            title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                            title.a("Cancelar", null);
                            title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                            DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                            dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                            dialogInterfaceC1108o1Create.show();
                            break;
                        case 10:
                            int i16 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                            break;
                        case 11:
                            int i17 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                            break;
                        case 12:
                            int i18 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                            break;
                        case 13:
                            int i19 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                            break;
                        case 14:
                            int i20 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        default:
                            int i21 = MainActivity.B0;
                            mainActivity.getClass();
                            mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                            break;
                    }
                }
            });
            this.E = findViewById(R.id.cardContinue);
            this.F = (TextView) findViewById(R.id.continueLabel);
            final int i10 = 15;
            K(R.id.cardContinue, new View.OnClickListener(this) { // from class: x.cs
                public final /* synthetic */ MainActivity i;

                {
                    this.i = this;
                }

                /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
                /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
                /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
                /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
                /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
                @Override // android.view.View.OnClickListener
                /*
                    Code decompiled incorrectly, please refer to instructions dump.
                */
                public final void onClick(View view) {
                    P8 p8;
                    P8 p82;
                    int i52 = i10;
                    P8 p83 = null;
                    P8 p84 = P8.h;
                    int i62 = 3;
                    P8 p85 = P8.i;
                    int i72 = 2;
                    P8 p86 = P8.j;
                    P8 p87 = P8.k;
                    int i82 = 1;
                    MainActivity mainActivity = this.i;
                    switch (i52) {
                        case 0:
                            char c = 1;
                            if (!mainActivity.Z) {
                                NK nk = mainActivity.p0;
                                if (nk != null) {
                                    P8 p88 = nk.a;
                                    if (p88 != p84 && p88 != p85) {
                                        if (p88 == p87) {
                                            p86 = p87;
                                        }
                                        mainActivity.C(p86);
                                        break;
                                    } else {
                                        mainActivity.F(p88, false);
                                        break;
                                    }
                                } else {
                                    mainActivity.C(p86);
                                    break;
                                }
                            } else {
                                String str = mainActivity.g0;
                                str.getClass();
                                switch (str.hashCode()) {
                                    case -1068259517:
                                        if (!str.equals("movies")) {
                                            c = 65535;
                                            break;
                                        } else {
                                            c = 0;
                                            break;
                                        }
                                    case -905838985:
                                        if (!str.equals("series")) {
                                        }
                                        break;
                                    case 115183:
                                        if (str.equals("tv1")) {
                                            c = 2;
                                            break;
                                        }
                                        break;
                                    case 115184:
                                        if (str.equals("tv2")) {
                                            c = 3;
                                            break;
                                        }
                                        break;
                                }
                                switch (c) {
                                    case 0:
                                        p83 = p86;
                                        break;
                                    case 1:
                                        p83 = p87;
                                        break;
                                    case 2:
                                        p83 = p84;
                                        break;
                                    case 3:
                                        p83 = p85;
                                        break;
                                }
                                if (p83 != null) {
                                    if (p83 != p84 && p83 != p85) {
                                        mainActivity.C(p83);
                                        break;
                                    } else {
                                        mainActivity.F(p83, false);
                                        break;
                                    }
                                }
                            }
                            break;
                        case 1:
                            ScrollView scrollView = mainActivity.o0;
                            if (scrollView != null) {
                                scrollView.smoothScrollTo(0, 0);
                                break;
                            }
                            break;
                        case 2:
                            int i92 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                            break;
                        case 3:
                            int i102 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                            break;
                        case 4:
                            int i11 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                            break;
                        case 5:
                            int i12 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                            break;
                        case 6:
                            if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                                mainActivity.A0 = true;
                                Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                                O8.i();
                                O8.h(mainActivity);
                                mainActivity.p0 = null;
                                mainActivity.x0 = false;
                                mainActivity.y0 = 0;
                                mainActivity.H();
                                mainActivity.I();
                                mainActivity.A0 = false;
                                break;
                            } else {
                                Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                                break;
                            }
                            break;
                        case 7:
                            int i13 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        case 8:
                            if (!mainActivity.Z) {
                                NK nk2 = mainActivity.p0;
                                if (nk2 != null) {
                                    mainActivity.D(nk2);
                                    break;
                                }
                            } else {
                                String str2 = mainActivity.g0;
                                str2.getClass();
                                switch (str2) {
                                    case "movies":
                                        p8 = p86;
                                        break;
                                    case "series":
                                        p8 = p87;
                                        break;
                                    case "tv1":
                                        p8 = p84;
                                        break;
                                    case "tv2":
                                        p8 = p85;
                                        break;
                                    default:
                                        p8 = null;
                                        break;
                                }
                                if (p8 != null) {
                                    if (!mainActivity.h0.isEmpty()) {
                                        ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                        int size = arrayList2.size();
                                        int i14 = 0;
                                        while (i14 < size) {
                                            Object obj = arrayList2.get(i14);
                                            i14++;
                                            C0806i9 c0806i9 = (C0806i9) obj;
                                            if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                                mainActivity.D(new NK(p8, c0806i9));
                                                break;
                                            }
                                        }
                                    }
                                    String str3 = mainActivity.g0;
                                    str3.getClass();
                                    switch (str3) {
                                        case "movies":
                                            p82 = p86;
                                            break;
                                        case "series":
                                            p82 = p87;
                                            break;
                                        case "tv1":
                                            p82 = p84;
                                            break;
                                        case "tv2":
                                            p82 = p85;
                                            break;
                                        default:
                                            p82 = null;
                                            break;
                                    }
                                    if (p82 != null) {
                                        if (p82 != p84 && p82 != p85) {
                                            mainActivity.C(p82);
                                            break;
                                        } else {
                                            mainActivity.F(p82, false);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                        case 9:
                            int i15 = MainActivity.B0;
                            C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                            title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                            title.a("Cancelar", null);
                            title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                            DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                            dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                            dialogInterfaceC1108o1Create.show();
                            break;
                        case 10:
                            int i16 = MainActivity.B0;
                            mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                            break;
                        case 11:
                            int i17 = MainActivity.B0;
                            mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                            break;
                        case 12:
                            int i18 = MainActivity.B0;
                            mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                            break;
                        case 13:
                            int i19 = MainActivity.B0;
                            mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                            break;
                        case 14:
                            int i20 = MainActivity.B0;
                            mainActivity.B();
                            break;
                        default:
                            int i21 = MainActivity.B0;
                            mainActivity.getClass();
                            mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                            break;
                    }
                }
            });
            I();
            return;
        }
        int iC = S6.c(this);
        getWindow().setStatusBarColor(iC);
        getWindow().setNavigationBarColor(iC);
        getWindow().getDecorView().setBackgroundColor(iC);
        View viewFindViewById = findViewById(R.id.tvHomeRoot);
        if (viewFindViewById != null) {
            viewFindViewById.setBackgroundResource(R.drawable.cochi_tv_dark_background);
        }
        View viewFindViewById2 = findViewById(R.id.tvHomeScroll);
        if (viewFindViewById2 != null) {
            viewFindViewById2.setBackgroundColor(iC);
        }
        View viewFindViewById3 = findViewById(R.id.tvHomeSidebar);
        int i11 = 20;
        if (viewFindViewById3 != null) {
            GradientDrawable gradientDrawable = new GradientDrawable();
            gradientDrawable.setColor(S6.g(this));
            gradientDrawable.setCornerRadius(y(20));
            gradientDrawable.setStroke(y(1), S6.d(this));
            viewFindViewById3.setBackground(gradientDrawable);
        }
        this.o0 = (ScrollView) findViewById(R.id.tvHomeScroll);
        this.S = (ProgressBar) findViewById(R.id.tvHomeLoading);
        this.T = (TextView) findViewById(R.id.tvHomeStatus);
        this.O = (LinearLayout) findViewById(R.id.homeContinueSection);
        this.P = (LinearLayout) findViewById(R.id.homeLiveSection);
        this.Q = (LinearLayout) findViewById(R.id.homeMoviesSection);
        this.R = (LinearLayout) findViewById(R.id.homeSeriesSection);
        this.U = (ImageView) findViewById(R.id.heroImage);
        this.V = (PlayerView) findViewById(R.id.heroVideo);
        this.W = (WebView) findViewById(R.id.heroYoutube);
        this.X = findViewById(R.id.heroScrim);
        this.i0 = (TextView) findViewById(R.id.heroEyebrow);
        this.j0 = (TextView) findViewById(R.id.heroTitle);
        this.k0 = (TextView) findViewById(R.id.heroDescription);
        this.l0 = (TextView) findViewById(R.id.heroMeta);
        this.m0 = (MaterialButton) findViewById(R.id.heroPlayButton);
        this.n0 = (MaterialButton) findViewById(R.id.heroExploreButton);
        w();
        View viewFindViewById4 = findViewById(R.id.heroCard);
        ScrollView scrollView = this.o0;
        if (scrollView != null && viewFindViewById4 != null) {
            scrollView.post(new RunnableC0747h2(this, i11, viewFindViewById4));
        }
        RecyclerView recyclerView = (RecyclerView) findViewById(R.id.homeContinueRecycler);
        final int i12 = 8;
        if (recyclerView != null) {
            recyclerView.setLayoutManager(new LinearLayoutManager(0));
            recyclerView.setHasFixedSize(true);
            recyclerView.setItemViewCacheSize(8);
        }
        C1134oc c1134oc = new C1134oc(this, new C0580ds(this, 0));
        this.N = c1134oc;
        recyclerView.setAdapter(c1134oc);
        final int i13 = 2;
        C1044mq c1044mq = new C1044mq(i13, this);
        this.K = new C1012m9(this, 1, c1044mq);
        this.L = new C1012m9(this, 2, c1044mq);
        this.M = new C1012m9(this, 2, c1044mq);
        L(R.id.tvNavHome, true, new View.OnClickListener(this) { // from class: x.cs
            public final /* synthetic */ MainActivity i;

            {
                this.i = this;
            }

            /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
            /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
            /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
            /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
            /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
            @Override // android.view.View.OnClickListener
            /*
                Code decompiled incorrectly, please refer to instructions dump.
            */
            public final void onClick(View view) {
                P8 p8;
                P8 p82;
                int i52 = i3;
                P8 p83 = null;
                P8 p84 = P8.h;
                int i62 = 3;
                P8 p85 = P8.i;
                int i72 = 2;
                P8 p86 = P8.j;
                P8 p87 = P8.k;
                int i82 = 1;
                MainActivity mainActivity = this.i;
                switch (i52) {
                    case 0:
                        char c = 1;
                        if (!mainActivity.Z) {
                            NK nk = mainActivity.p0;
                            if (nk != null) {
                                P8 p88 = nk.a;
                                if (p88 != p84 && p88 != p85) {
                                    if (p88 == p87) {
                                        p86 = p87;
                                    }
                                    mainActivity.C(p86);
                                    break;
                                } else {
                                    mainActivity.F(p88, false);
                                    break;
                                }
                            } else {
                                mainActivity.C(p86);
                                break;
                            }
                        } else {
                            String str = mainActivity.g0;
                            str.getClass();
                            switch (str.hashCode()) {
                                case -1068259517:
                                    if (!str.equals("movies")) {
                                        c = 65535;
                                        break;
                                    } else {
                                        c = 0;
                                        break;
                                    }
                                case -905838985:
                                    if (!str.equals("series")) {
                                    }
                                    break;
                                case 115183:
                                    if (str.equals("tv1")) {
                                        c = 2;
                                        break;
                                    }
                                    break;
                                case 115184:
                                    if (str.equals("tv2")) {
                                        c = 3;
                                        break;
                                    }
                                    break;
                            }
                            switch (c) {
                                case 0:
                                    p83 = p86;
                                    break;
                                case 1:
                                    p83 = p87;
                                    break;
                                case 2:
                                    p83 = p84;
                                    break;
                                case 3:
                                    p83 = p85;
                                    break;
                            }
                            if (p83 != null) {
                                if (p83 != p84 && p83 != p85) {
                                    mainActivity.C(p83);
                                    break;
                                } else {
                                    mainActivity.F(p83, false);
                                    break;
                                }
                            }
                        }
                        break;
                    case 1:
                        ScrollView scrollView2 = mainActivity.o0;
                        if (scrollView2 != null) {
                            scrollView2.smoothScrollTo(0, 0);
                            break;
                        }
                        break;
                    case 2:
                        int i92 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                        break;
                    case 3:
                        int i102 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                        break;
                    case 4:
                        int i112 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                        break;
                    case 5:
                        int i122 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                        break;
                    case 6:
                        if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                            mainActivity.A0 = true;
                            Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                            O8.i();
                            O8.h(mainActivity);
                            mainActivity.p0 = null;
                            mainActivity.x0 = false;
                            mainActivity.y0 = 0;
                            mainActivity.H();
                            mainActivity.I();
                            mainActivity.A0 = false;
                            break;
                        } else {
                            Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                            break;
                        }
                        break;
                    case 7:
                        int i132 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    case 8:
                        if (!mainActivity.Z) {
                            NK nk2 = mainActivity.p0;
                            if (nk2 != null) {
                                mainActivity.D(nk2);
                                break;
                            }
                        } else {
                            String str2 = mainActivity.g0;
                            str2.getClass();
                            switch (str2) {
                                case "movies":
                                    p8 = p86;
                                    break;
                                case "series":
                                    p8 = p87;
                                    break;
                                case "tv1":
                                    p8 = p84;
                                    break;
                                case "tv2":
                                    p8 = p85;
                                    break;
                                default:
                                    p8 = null;
                                    break;
                            }
                            if (p8 != null) {
                                if (!mainActivity.h0.isEmpty()) {
                                    ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                    int size = arrayList2.size();
                                    int i14 = 0;
                                    while (i14 < size) {
                                        Object obj = arrayList2.get(i14);
                                        i14++;
                                        C0806i9 c0806i9 = (C0806i9) obj;
                                        if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                            mainActivity.D(new NK(p8, c0806i9));
                                            break;
                                        }
                                    }
                                }
                                String str3 = mainActivity.g0;
                                str3.getClass();
                                switch (str3) {
                                    case "movies":
                                        p82 = p86;
                                        break;
                                    case "series":
                                        p82 = p87;
                                        break;
                                    case "tv1":
                                        p82 = p84;
                                        break;
                                    case "tv2":
                                        p82 = p85;
                                        break;
                                    default:
                                        p82 = null;
                                        break;
                                }
                                if (p82 != null) {
                                    if (p82 != p84 && p82 != p85) {
                                        mainActivity.C(p82);
                                        break;
                                    } else {
                                        mainActivity.F(p82, false);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        int i15 = MainActivity.B0;
                        C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                        title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                        title.a("Cancelar", null);
                        title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                        DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                        dialogInterfaceC1108o1Create.show();
                        break;
                    case 10:
                        int i16 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                        break;
                    case 11:
                        int i17 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                        break;
                    case 12:
                        int i18 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                        break;
                    case 13:
                        int i19 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                        break;
                    case 14:
                        int i20 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    default:
                        int i21 = MainActivity.B0;
                        mainActivity.getClass();
                        mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                        break;
                }
            }
        });
        L(R.id.tvNavTv1, false, new View.OnClickListener(this) { // from class: x.cs
            public final /* synthetic */ MainActivity i;

            {
                this.i = this;
            }

            /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
            /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
            /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
            /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
            /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
            @Override // android.view.View.OnClickListener
            /*
                Code decompiled incorrectly, please refer to instructions dump.
            */
            public final void onClick(View view) {
                P8 p8;
                P8 p82;
                int i52 = i13;
                P8 p83 = null;
                P8 p84 = P8.h;
                int i62 = 3;
                P8 p85 = P8.i;
                int i72 = 2;
                P8 p86 = P8.j;
                P8 p87 = P8.k;
                int i82 = 1;
                MainActivity mainActivity = this.i;
                switch (i52) {
                    case 0:
                        char c = 1;
                        if (!mainActivity.Z) {
                            NK nk = mainActivity.p0;
                            if (nk != null) {
                                P8 p88 = nk.a;
                                if (p88 != p84 && p88 != p85) {
                                    if (p88 == p87) {
                                        p86 = p87;
                                    }
                                    mainActivity.C(p86);
                                    break;
                                } else {
                                    mainActivity.F(p88, false);
                                    break;
                                }
                            } else {
                                mainActivity.C(p86);
                                break;
                            }
                        } else {
                            String str = mainActivity.g0;
                            str.getClass();
                            switch (str.hashCode()) {
                                case -1068259517:
                                    if (!str.equals("movies")) {
                                        c = 65535;
                                        break;
                                    } else {
                                        c = 0;
                                        break;
                                    }
                                case -905838985:
                                    if (!str.equals("series")) {
                                    }
                                    break;
                                case 115183:
                                    if (str.equals("tv1")) {
                                        c = 2;
                                        break;
                                    }
                                    break;
                                case 115184:
                                    if (str.equals("tv2")) {
                                        c = 3;
                                        break;
                                    }
                                    break;
                            }
                            switch (c) {
                                case 0:
                                    p83 = p86;
                                    break;
                                case 1:
                                    p83 = p87;
                                    break;
                                case 2:
                                    p83 = p84;
                                    break;
                                case 3:
                                    p83 = p85;
                                    break;
                            }
                            if (p83 != null) {
                                if (p83 != p84 && p83 != p85) {
                                    mainActivity.C(p83);
                                    break;
                                } else {
                                    mainActivity.F(p83, false);
                                    break;
                                }
                            }
                        }
                        break;
                    case 1:
                        ScrollView scrollView2 = mainActivity.o0;
                        if (scrollView2 != null) {
                            scrollView2.smoothScrollTo(0, 0);
                            break;
                        }
                        break;
                    case 2:
                        int i92 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                        break;
                    case 3:
                        int i102 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                        break;
                    case 4:
                        int i112 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                        break;
                    case 5:
                        int i122 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                        break;
                    case 6:
                        if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                            mainActivity.A0 = true;
                            Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                            O8.i();
                            O8.h(mainActivity);
                            mainActivity.p0 = null;
                            mainActivity.x0 = false;
                            mainActivity.y0 = 0;
                            mainActivity.H();
                            mainActivity.I();
                            mainActivity.A0 = false;
                            break;
                        } else {
                            Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                            break;
                        }
                        break;
                    case 7:
                        int i132 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    case 8:
                        if (!mainActivity.Z) {
                            NK nk2 = mainActivity.p0;
                            if (nk2 != null) {
                                mainActivity.D(nk2);
                                break;
                            }
                        } else {
                            String str2 = mainActivity.g0;
                            str2.getClass();
                            switch (str2) {
                                case "movies":
                                    p8 = p86;
                                    break;
                                case "series":
                                    p8 = p87;
                                    break;
                                case "tv1":
                                    p8 = p84;
                                    break;
                                case "tv2":
                                    p8 = p85;
                                    break;
                                default:
                                    p8 = null;
                                    break;
                            }
                            if (p8 != null) {
                                if (!mainActivity.h0.isEmpty()) {
                                    ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                    int size = arrayList2.size();
                                    int i14 = 0;
                                    while (i14 < size) {
                                        Object obj = arrayList2.get(i14);
                                        i14++;
                                        C0806i9 c0806i9 = (C0806i9) obj;
                                        if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                            mainActivity.D(new NK(p8, c0806i9));
                                            break;
                                        }
                                    }
                                }
                                String str3 = mainActivity.g0;
                                str3.getClass();
                                switch (str3) {
                                    case "movies":
                                        p82 = p86;
                                        break;
                                    case "series":
                                        p82 = p87;
                                        break;
                                    case "tv1":
                                        p82 = p84;
                                        break;
                                    case "tv2":
                                        p82 = p85;
                                        break;
                                    default:
                                        p82 = null;
                                        break;
                                }
                                if (p82 != null) {
                                    if (p82 != p84 && p82 != p85) {
                                        mainActivity.C(p82);
                                        break;
                                    } else {
                                        mainActivity.F(p82, false);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        int i15 = MainActivity.B0;
                        C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                        title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                        title.a("Cancelar", null);
                        title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                        DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                        dialogInterfaceC1108o1Create.show();
                        break;
                    case 10:
                        int i16 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                        break;
                    case 11:
                        int i17 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                        break;
                    case 12:
                        int i18 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                        break;
                    case 13:
                        int i19 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                        break;
                    case 14:
                        int i20 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    default:
                        int i21 = MainActivity.B0;
                        mainActivity.getClass();
                        mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                        break;
                }
            }
        });
        final int i14 = 3;
        L(R.id.tvNavTv2, false, new View.OnClickListener(this) { // from class: x.cs
            public final /* synthetic */ MainActivity i;

            {
                this.i = this;
            }

            /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
            /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
            /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
            /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
            /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
            @Override // android.view.View.OnClickListener
            /*
                Code decompiled incorrectly, please refer to instructions dump.
            */
            public final void onClick(View view) {
                P8 p8;
                P8 p82;
                int i52 = i14;
                P8 p83 = null;
                P8 p84 = P8.h;
                int i62 = 3;
                P8 p85 = P8.i;
                int i72 = 2;
                P8 p86 = P8.j;
                P8 p87 = P8.k;
                int i82 = 1;
                MainActivity mainActivity = this.i;
                switch (i52) {
                    case 0:
                        char c = 1;
                        if (!mainActivity.Z) {
                            NK nk = mainActivity.p0;
                            if (nk != null) {
                                P8 p88 = nk.a;
                                if (p88 != p84 && p88 != p85) {
                                    if (p88 == p87) {
                                        p86 = p87;
                                    }
                                    mainActivity.C(p86);
                                    break;
                                } else {
                                    mainActivity.F(p88, false);
                                    break;
                                }
                            } else {
                                mainActivity.C(p86);
                                break;
                            }
                        } else {
                            String str = mainActivity.g0;
                            str.getClass();
                            switch (str.hashCode()) {
                                case -1068259517:
                                    if (!str.equals("movies")) {
                                        c = 65535;
                                        break;
                                    } else {
                                        c = 0;
                                        break;
                                    }
                                case -905838985:
                                    if (!str.equals("series")) {
                                    }
                                    break;
                                case 115183:
                                    if (str.equals("tv1")) {
                                        c = 2;
                                        break;
                                    }
                                    break;
                                case 115184:
                                    if (str.equals("tv2")) {
                                        c = 3;
                                        break;
                                    }
                                    break;
                            }
                            switch (c) {
                                case 0:
                                    p83 = p86;
                                    break;
                                case 1:
                                    p83 = p87;
                                    break;
                                case 2:
                                    p83 = p84;
                                    break;
                                case 3:
                                    p83 = p85;
                                    break;
                            }
                            if (p83 != null) {
                                if (p83 != p84 && p83 != p85) {
                                    mainActivity.C(p83);
                                    break;
                                } else {
                                    mainActivity.F(p83, false);
                                    break;
                                }
                            }
                        }
                        break;
                    case 1:
                        ScrollView scrollView2 = mainActivity.o0;
                        if (scrollView2 != null) {
                            scrollView2.smoothScrollTo(0, 0);
                            break;
                        }
                        break;
                    case 2:
                        int i92 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                        break;
                    case 3:
                        int i102 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                        break;
                    case 4:
                        int i112 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                        break;
                    case 5:
                        int i122 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                        break;
                    case 6:
                        if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                            mainActivity.A0 = true;
                            Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                            O8.i();
                            O8.h(mainActivity);
                            mainActivity.p0 = null;
                            mainActivity.x0 = false;
                            mainActivity.y0 = 0;
                            mainActivity.H();
                            mainActivity.I();
                            mainActivity.A0 = false;
                            break;
                        } else {
                            Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                            break;
                        }
                        break;
                    case 7:
                        int i132 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    case 8:
                        if (!mainActivity.Z) {
                            NK nk2 = mainActivity.p0;
                            if (nk2 != null) {
                                mainActivity.D(nk2);
                                break;
                            }
                        } else {
                            String str2 = mainActivity.g0;
                            str2.getClass();
                            switch (str2) {
                                case "movies":
                                    p8 = p86;
                                    break;
                                case "series":
                                    p8 = p87;
                                    break;
                                case "tv1":
                                    p8 = p84;
                                    break;
                                case "tv2":
                                    p8 = p85;
                                    break;
                                default:
                                    p8 = null;
                                    break;
                            }
                            if (p8 != null) {
                                if (!mainActivity.h0.isEmpty()) {
                                    ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                    int size = arrayList2.size();
                                    int i142 = 0;
                                    while (i142 < size) {
                                        Object obj = arrayList2.get(i142);
                                        i142++;
                                        C0806i9 c0806i9 = (C0806i9) obj;
                                        if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                            mainActivity.D(new NK(p8, c0806i9));
                                            break;
                                        }
                                    }
                                }
                                String str3 = mainActivity.g0;
                                str3.getClass();
                                switch (str3) {
                                    case "movies":
                                        p82 = p86;
                                        break;
                                    case "series":
                                        p82 = p87;
                                        break;
                                    case "tv1":
                                        p82 = p84;
                                        break;
                                    case "tv2":
                                        p82 = p85;
                                        break;
                                    default:
                                        p82 = null;
                                        break;
                                }
                                if (p82 != null) {
                                    if (p82 != p84 && p82 != p85) {
                                        mainActivity.C(p82);
                                        break;
                                    } else {
                                        mainActivity.F(p82, false);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        int i15 = MainActivity.B0;
                        C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                        title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                        title.a("Cancelar", null);
                        title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                        DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                        dialogInterfaceC1108o1Create.show();
                        break;
                    case 10:
                        int i16 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                        break;
                    case 11:
                        int i17 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                        break;
                    case 12:
                        int i18 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                        break;
                    case 13:
                        int i19 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                        break;
                    case 14:
                        int i20 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    default:
                        int i21 = MainActivity.B0;
                        mainActivity.getClass();
                        mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                        break;
                }
            }
        });
        L(R.id.tvNavMovies, false, new View.OnClickListener(this) { // from class: x.cs
            public final /* synthetic */ MainActivity i;

            {
                this.i = this;
            }

            /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
            /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
            /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
            /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
            /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
            @Override // android.view.View.OnClickListener
            /*
                Code decompiled incorrectly, please refer to instructions dump.
            */
            public final void onClick(View view) {
                P8 p8;
                P8 p82;
                int i52 = i;
                P8 p83 = null;
                P8 p84 = P8.h;
                int i62 = 3;
                P8 p85 = P8.i;
                int i72 = 2;
                P8 p86 = P8.j;
                P8 p87 = P8.k;
                int i82 = 1;
                MainActivity mainActivity = this.i;
                switch (i52) {
                    case 0:
                        char c = 1;
                        if (!mainActivity.Z) {
                            NK nk = mainActivity.p0;
                            if (nk != null) {
                                P8 p88 = nk.a;
                                if (p88 != p84 && p88 != p85) {
                                    if (p88 == p87) {
                                        p86 = p87;
                                    }
                                    mainActivity.C(p86);
                                    break;
                                } else {
                                    mainActivity.F(p88, false);
                                    break;
                                }
                            } else {
                                mainActivity.C(p86);
                                break;
                            }
                        } else {
                            String str = mainActivity.g0;
                            str.getClass();
                            switch (str.hashCode()) {
                                case -1068259517:
                                    if (!str.equals("movies")) {
                                        c = 65535;
                                        break;
                                    } else {
                                        c = 0;
                                        break;
                                    }
                                case -905838985:
                                    if (!str.equals("series")) {
                                    }
                                    break;
                                case 115183:
                                    if (str.equals("tv1")) {
                                        c = 2;
                                        break;
                                    }
                                    break;
                                case 115184:
                                    if (str.equals("tv2")) {
                                        c = 3;
                                        break;
                                    }
                                    break;
                            }
                            switch (c) {
                                case 0:
                                    p83 = p86;
                                    break;
                                case 1:
                                    p83 = p87;
                                    break;
                                case 2:
                                    p83 = p84;
                                    break;
                                case 3:
                                    p83 = p85;
                                    break;
                            }
                            if (p83 != null) {
                                if (p83 != p84 && p83 != p85) {
                                    mainActivity.C(p83);
                                    break;
                                } else {
                                    mainActivity.F(p83, false);
                                    break;
                                }
                            }
                        }
                        break;
                    case 1:
                        ScrollView scrollView2 = mainActivity.o0;
                        if (scrollView2 != null) {
                            scrollView2.smoothScrollTo(0, 0);
                            break;
                        }
                        break;
                    case 2:
                        int i92 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                        break;
                    case 3:
                        int i102 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                        break;
                    case 4:
                        int i112 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                        break;
                    case 5:
                        int i122 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                        break;
                    case 6:
                        if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                            mainActivity.A0 = true;
                            Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                            O8.i();
                            O8.h(mainActivity);
                            mainActivity.p0 = null;
                            mainActivity.x0 = false;
                            mainActivity.y0 = 0;
                            mainActivity.H();
                            mainActivity.I();
                            mainActivity.A0 = false;
                            break;
                        } else {
                            Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                            break;
                        }
                        break;
                    case 7:
                        int i132 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    case 8:
                        if (!mainActivity.Z) {
                            NK nk2 = mainActivity.p0;
                            if (nk2 != null) {
                                mainActivity.D(nk2);
                                break;
                            }
                        } else {
                            String str2 = mainActivity.g0;
                            str2.getClass();
                            switch (str2) {
                                case "movies":
                                    p8 = p86;
                                    break;
                                case "series":
                                    p8 = p87;
                                    break;
                                case "tv1":
                                    p8 = p84;
                                    break;
                                case "tv2":
                                    p8 = p85;
                                    break;
                                default:
                                    p8 = null;
                                    break;
                            }
                            if (p8 != null) {
                                if (!mainActivity.h0.isEmpty()) {
                                    ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                    int size = arrayList2.size();
                                    int i142 = 0;
                                    while (i142 < size) {
                                        Object obj = arrayList2.get(i142);
                                        i142++;
                                        C0806i9 c0806i9 = (C0806i9) obj;
                                        if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                            mainActivity.D(new NK(p8, c0806i9));
                                            break;
                                        }
                                    }
                                }
                                String str3 = mainActivity.g0;
                                str3.getClass();
                                switch (str3) {
                                    case "movies":
                                        p82 = p86;
                                        break;
                                    case "series":
                                        p82 = p87;
                                        break;
                                    case "tv1":
                                        p82 = p84;
                                        break;
                                    case "tv2":
                                        p82 = p85;
                                        break;
                                    default:
                                        p82 = null;
                                        break;
                                }
                                if (p82 != null) {
                                    if (p82 != p84 && p82 != p85) {
                                        mainActivity.C(p82);
                                        break;
                                    } else {
                                        mainActivity.F(p82, false);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        int i15 = MainActivity.B0;
                        C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                        title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                        title.a("Cancelar", null);
                        title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                        DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                        dialogInterfaceC1108o1Create.show();
                        break;
                    case 10:
                        int i16 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                        break;
                    case 11:
                        int i17 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                        break;
                    case 12:
                        int i18 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                        break;
                    case 13:
                        int i19 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                        break;
                    case 14:
                        int i20 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    default:
                        int i21 = MainActivity.B0;
                        mainActivity.getClass();
                        mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                        break;
                }
            }
        });
        final int i15 = 5;
        L(R.id.tvNavSeries, false, new View.OnClickListener(this) { // from class: x.cs
            public final /* synthetic */ MainActivity i;

            {
                this.i = this;
            }

            /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
            /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
            /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
            /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
            /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
            @Override // android.view.View.OnClickListener
            /*
                Code decompiled incorrectly, please refer to instructions dump.
            */
            public final void onClick(View view) {
                P8 p8;
                P8 p82;
                int i52 = i15;
                P8 p83 = null;
                P8 p84 = P8.h;
                int i62 = 3;
                P8 p85 = P8.i;
                int i72 = 2;
                P8 p86 = P8.j;
                P8 p87 = P8.k;
                int i82 = 1;
                MainActivity mainActivity = this.i;
                switch (i52) {
                    case 0:
                        char c = 1;
                        if (!mainActivity.Z) {
                            NK nk = mainActivity.p0;
                            if (nk != null) {
                                P8 p88 = nk.a;
                                if (p88 != p84 && p88 != p85) {
                                    if (p88 == p87) {
                                        p86 = p87;
                                    }
                                    mainActivity.C(p86);
                                    break;
                                } else {
                                    mainActivity.F(p88, false);
                                    break;
                                }
                            } else {
                                mainActivity.C(p86);
                                break;
                            }
                        } else {
                            String str = mainActivity.g0;
                            str.getClass();
                            switch (str.hashCode()) {
                                case -1068259517:
                                    if (!str.equals("movies")) {
                                        c = 65535;
                                        break;
                                    } else {
                                        c = 0;
                                        break;
                                    }
                                case -905838985:
                                    if (!str.equals("series")) {
                                    }
                                    break;
                                case 115183:
                                    if (str.equals("tv1")) {
                                        c = 2;
                                        break;
                                    }
                                    break;
                                case 115184:
                                    if (str.equals("tv2")) {
                                        c = 3;
                                        break;
                                    }
                                    break;
                            }
                            switch (c) {
                                case 0:
                                    p83 = p86;
                                    break;
                                case 1:
                                    p83 = p87;
                                    break;
                                case 2:
                                    p83 = p84;
                                    break;
                                case 3:
                                    p83 = p85;
                                    break;
                            }
                            if (p83 != null) {
                                if (p83 != p84 && p83 != p85) {
                                    mainActivity.C(p83);
                                    break;
                                } else {
                                    mainActivity.F(p83, false);
                                    break;
                                }
                            }
                        }
                        break;
                    case 1:
                        ScrollView scrollView2 = mainActivity.o0;
                        if (scrollView2 != null) {
                            scrollView2.smoothScrollTo(0, 0);
                            break;
                        }
                        break;
                    case 2:
                        int i92 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                        break;
                    case 3:
                        int i102 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                        break;
                    case 4:
                        int i112 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                        break;
                    case 5:
                        int i122 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                        break;
                    case 6:
                        if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                            mainActivity.A0 = true;
                            Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                            O8.i();
                            O8.h(mainActivity);
                            mainActivity.p0 = null;
                            mainActivity.x0 = false;
                            mainActivity.y0 = 0;
                            mainActivity.H();
                            mainActivity.I();
                            mainActivity.A0 = false;
                            break;
                        } else {
                            Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                            break;
                        }
                        break;
                    case 7:
                        int i132 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    case 8:
                        if (!mainActivity.Z) {
                            NK nk2 = mainActivity.p0;
                            if (nk2 != null) {
                                mainActivity.D(nk2);
                                break;
                            }
                        } else {
                            String str2 = mainActivity.g0;
                            str2.getClass();
                            switch (str2) {
                                case "movies":
                                    p8 = p86;
                                    break;
                                case "series":
                                    p8 = p87;
                                    break;
                                case "tv1":
                                    p8 = p84;
                                    break;
                                case "tv2":
                                    p8 = p85;
                                    break;
                                default:
                                    p8 = null;
                                    break;
                            }
                            if (p8 != null) {
                                if (!mainActivity.h0.isEmpty()) {
                                    ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                    int size = arrayList2.size();
                                    int i142 = 0;
                                    while (i142 < size) {
                                        Object obj = arrayList2.get(i142);
                                        i142++;
                                        C0806i9 c0806i9 = (C0806i9) obj;
                                        if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                            mainActivity.D(new NK(p8, c0806i9));
                                            break;
                                        }
                                    }
                                }
                                String str3 = mainActivity.g0;
                                str3.getClass();
                                switch (str3) {
                                    case "movies":
                                        p82 = p86;
                                        break;
                                    case "series":
                                        p82 = p87;
                                        break;
                                    case "tv1":
                                        p82 = p84;
                                        break;
                                    case "tv2":
                                        p82 = p85;
                                        break;
                                    default:
                                        p82 = null;
                                        break;
                                }
                                if (p82 != null) {
                                    if (p82 != p84 && p82 != p85) {
                                        mainActivity.C(p82);
                                        break;
                                    } else {
                                        mainActivity.F(p82, false);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        int i152 = MainActivity.B0;
                        C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                        title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                        title.a("Cancelar", null);
                        title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                        DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                        dialogInterfaceC1108o1Create.show();
                        break;
                    case 10:
                        int i16 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                        break;
                    case 11:
                        int i17 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                        break;
                    case 12:
                        int i18 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                        break;
                    case 13:
                        int i19 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                        break;
                    case 14:
                        int i20 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    default:
                        int i21 = MainActivity.B0;
                        mainActivity.getClass();
                        mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                        break;
                }
            }
        });
        final int i16 = 6;
        L(R.id.tvNavRefresh, false, new View.OnClickListener(this) { // from class: x.cs
            public final /* synthetic */ MainActivity i;

            {
                this.i = this;
            }

            /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
            /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
            /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
            /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
            /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
            @Override // android.view.View.OnClickListener
            /*
                Code decompiled incorrectly, please refer to instructions dump.
            */
            public final void onClick(View view) {
                P8 p8;
                P8 p82;
                int i52 = i16;
                P8 p83 = null;
                P8 p84 = P8.h;
                int i62 = 3;
                P8 p85 = P8.i;
                int i72 = 2;
                P8 p86 = P8.j;
                P8 p87 = P8.k;
                int i82 = 1;
                MainActivity mainActivity = this.i;
                switch (i52) {
                    case 0:
                        char c = 1;
                        if (!mainActivity.Z) {
                            NK nk = mainActivity.p0;
                            if (nk != null) {
                                P8 p88 = nk.a;
                                if (p88 != p84 && p88 != p85) {
                                    if (p88 == p87) {
                                        p86 = p87;
                                    }
                                    mainActivity.C(p86);
                                    break;
                                } else {
                                    mainActivity.F(p88, false);
                                    break;
                                }
                            } else {
                                mainActivity.C(p86);
                                break;
                            }
                        } else {
                            String str = mainActivity.g0;
                            str.getClass();
                            switch (str.hashCode()) {
                                case -1068259517:
                                    if (!str.equals("movies")) {
                                        c = 65535;
                                        break;
                                    } else {
                                        c = 0;
                                        break;
                                    }
                                case -905838985:
                                    if (!str.equals("series")) {
                                    }
                                    break;
                                case 115183:
                                    if (str.equals("tv1")) {
                                        c = 2;
                                        break;
                                    }
                                    break;
                                case 115184:
                                    if (str.equals("tv2")) {
                                        c = 3;
                                        break;
                                    }
                                    break;
                            }
                            switch (c) {
                                case 0:
                                    p83 = p86;
                                    break;
                                case 1:
                                    p83 = p87;
                                    break;
                                case 2:
                                    p83 = p84;
                                    break;
                                case 3:
                                    p83 = p85;
                                    break;
                            }
                            if (p83 != null) {
                                if (p83 != p84 && p83 != p85) {
                                    mainActivity.C(p83);
                                    break;
                                } else {
                                    mainActivity.F(p83, false);
                                    break;
                                }
                            }
                        }
                        break;
                    case 1:
                        ScrollView scrollView2 = mainActivity.o0;
                        if (scrollView2 != null) {
                            scrollView2.smoothScrollTo(0, 0);
                            break;
                        }
                        break;
                    case 2:
                        int i92 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                        break;
                    case 3:
                        int i102 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                        break;
                    case 4:
                        int i112 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                        break;
                    case 5:
                        int i122 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                        break;
                    case 6:
                        if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                            mainActivity.A0 = true;
                            Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                            O8.i();
                            O8.h(mainActivity);
                            mainActivity.p0 = null;
                            mainActivity.x0 = false;
                            mainActivity.y0 = 0;
                            mainActivity.H();
                            mainActivity.I();
                            mainActivity.A0 = false;
                            break;
                        } else {
                            Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                            break;
                        }
                        break;
                    case 7:
                        int i132 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    case 8:
                        if (!mainActivity.Z) {
                            NK nk2 = mainActivity.p0;
                            if (nk2 != null) {
                                mainActivity.D(nk2);
                                break;
                            }
                        } else {
                            String str2 = mainActivity.g0;
                            str2.getClass();
                            switch (str2) {
                                case "movies":
                                    p8 = p86;
                                    break;
                                case "series":
                                    p8 = p87;
                                    break;
                                case "tv1":
                                    p8 = p84;
                                    break;
                                case "tv2":
                                    p8 = p85;
                                    break;
                                default:
                                    p8 = null;
                                    break;
                            }
                            if (p8 != null) {
                                if (!mainActivity.h0.isEmpty()) {
                                    ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                    int size = arrayList2.size();
                                    int i142 = 0;
                                    while (i142 < size) {
                                        Object obj = arrayList2.get(i142);
                                        i142++;
                                        C0806i9 c0806i9 = (C0806i9) obj;
                                        if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                            mainActivity.D(new NK(p8, c0806i9));
                                            break;
                                        }
                                    }
                                }
                                String str3 = mainActivity.g0;
                                str3.getClass();
                                switch (str3) {
                                    case "movies":
                                        p82 = p86;
                                        break;
                                    case "series":
                                        p82 = p87;
                                        break;
                                    case "tv1":
                                        p82 = p84;
                                        break;
                                    case "tv2":
                                        p82 = p85;
                                        break;
                                    default:
                                        p82 = null;
                                        break;
                                }
                                if (p82 != null) {
                                    if (p82 != p84 && p82 != p85) {
                                        mainActivity.C(p82);
                                        break;
                                    } else {
                                        mainActivity.F(p82, false);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        int i152 = MainActivity.B0;
                        C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                        title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                        title.a("Cancelar", null);
                        title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                        DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                        dialogInterfaceC1108o1Create.show();
                        break;
                    case 10:
                        int i162 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                        break;
                    case 11:
                        int i17 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                        break;
                    case 12:
                        int i18 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                        break;
                    case 13:
                        int i19 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                        break;
                    case 14:
                        int i20 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    default:
                        int i21 = MainActivity.B0;
                        mainActivity.getClass();
                        mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                        break;
                }
            }
        });
        final int i17 = 7;
        L(R.id.tvNavAdult, false, new View.OnClickListener(this) { // from class: x.cs
            public final /* synthetic */ MainActivity i;

            {
                this.i = this;
            }

            /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
            /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
            /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
            /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
            /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
            @Override // android.view.View.OnClickListener
            /*
                Code decompiled incorrectly, please refer to instructions dump.
            */
            public final void onClick(View view) {
                P8 p8;
                P8 p82;
                int i52 = i17;
                P8 p83 = null;
                P8 p84 = P8.h;
                int i62 = 3;
                P8 p85 = P8.i;
                int i72 = 2;
                P8 p86 = P8.j;
                P8 p87 = P8.k;
                int i82 = 1;
                MainActivity mainActivity = this.i;
                switch (i52) {
                    case 0:
                        char c = 1;
                        if (!mainActivity.Z) {
                            NK nk = mainActivity.p0;
                            if (nk != null) {
                                P8 p88 = nk.a;
                                if (p88 != p84 && p88 != p85) {
                                    if (p88 == p87) {
                                        p86 = p87;
                                    }
                                    mainActivity.C(p86);
                                    break;
                                } else {
                                    mainActivity.F(p88, false);
                                    break;
                                }
                            } else {
                                mainActivity.C(p86);
                                break;
                            }
                        } else {
                            String str = mainActivity.g0;
                            str.getClass();
                            switch (str.hashCode()) {
                                case -1068259517:
                                    if (!str.equals("movies")) {
                                        c = 65535;
                                        break;
                                    } else {
                                        c = 0;
                                        break;
                                    }
                                case -905838985:
                                    if (!str.equals("series")) {
                                    }
                                    break;
                                case 115183:
                                    if (str.equals("tv1")) {
                                        c = 2;
                                        break;
                                    }
                                    break;
                                case 115184:
                                    if (str.equals("tv2")) {
                                        c = 3;
                                        break;
                                    }
                                    break;
                            }
                            switch (c) {
                                case 0:
                                    p83 = p86;
                                    break;
                                case 1:
                                    p83 = p87;
                                    break;
                                case 2:
                                    p83 = p84;
                                    break;
                                case 3:
                                    p83 = p85;
                                    break;
                            }
                            if (p83 != null) {
                                if (p83 != p84 && p83 != p85) {
                                    mainActivity.C(p83);
                                    break;
                                } else {
                                    mainActivity.F(p83, false);
                                    break;
                                }
                            }
                        }
                        break;
                    case 1:
                        ScrollView scrollView2 = mainActivity.o0;
                        if (scrollView2 != null) {
                            scrollView2.smoothScrollTo(0, 0);
                            break;
                        }
                        break;
                    case 2:
                        int i92 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                        break;
                    case 3:
                        int i102 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                        break;
                    case 4:
                        int i112 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                        break;
                    case 5:
                        int i122 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                        break;
                    case 6:
                        if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                            mainActivity.A0 = true;
                            Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                            O8.i();
                            O8.h(mainActivity);
                            mainActivity.p0 = null;
                            mainActivity.x0 = false;
                            mainActivity.y0 = 0;
                            mainActivity.H();
                            mainActivity.I();
                            mainActivity.A0 = false;
                            break;
                        } else {
                            Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                            break;
                        }
                        break;
                    case 7:
                        int i132 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    case 8:
                        if (!mainActivity.Z) {
                            NK nk2 = mainActivity.p0;
                            if (nk2 != null) {
                                mainActivity.D(nk2);
                                break;
                            }
                        } else {
                            String str2 = mainActivity.g0;
                            str2.getClass();
                            switch (str2) {
                                case "movies":
                                    p8 = p86;
                                    break;
                                case "series":
                                    p8 = p87;
                                    break;
                                case "tv1":
                                    p8 = p84;
                                    break;
                                case "tv2":
                                    p8 = p85;
                                    break;
                                default:
                                    p8 = null;
                                    break;
                            }
                            if (p8 != null) {
                                if (!mainActivity.h0.isEmpty()) {
                                    ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                    int size = arrayList2.size();
                                    int i142 = 0;
                                    while (i142 < size) {
                                        Object obj = arrayList2.get(i142);
                                        i142++;
                                        C0806i9 c0806i9 = (C0806i9) obj;
                                        if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                            mainActivity.D(new NK(p8, c0806i9));
                                            break;
                                        }
                                    }
                                }
                                String str3 = mainActivity.g0;
                                str3.getClass();
                                switch (str3) {
                                    case "movies":
                                        p82 = p86;
                                        break;
                                    case "series":
                                        p82 = p87;
                                        break;
                                    case "tv1":
                                        p82 = p84;
                                        break;
                                    case "tv2":
                                        p82 = p85;
                                        break;
                                    default:
                                        p82 = null;
                                        break;
                                }
                                if (p82 != null) {
                                    if (p82 != p84 && p82 != p85) {
                                        mainActivity.C(p82);
                                        break;
                                    } else {
                                        mainActivity.F(p82, false);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        int i152 = MainActivity.B0;
                        C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                        title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                        title.a("Cancelar", null);
                        title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                        DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                        dialogInterfaceC1108o1Create.show();
                        break;
                    case 10:
                        int i162 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                        break;
                    case 11:
                        int i172 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                        break;
                    case 12:
                        int i18 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                        break;
                    case 13:
                        int i19 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                        break;
                    case 14:
                        int i20 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    default:
                        int i21 = MainActivity.B0;
                        mainActivity.getClass();
                        mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                        break;
                }
            }
        });
        MaterialButton materialButton = this.m0;
        if (materialButton != null) {
            materialButton.setOnFocusChangeListener(new ViewOnFocusChangeListenerC0856j9(this, i14, materialButton));
        }
        MaterialButton materialButton2 = this.n0;
        if (materialButton2 != null) {
            materialButton2.setOnFocusChangeListener(new ViewOnFocusChangeListenerC0856j9(this, i14, materialButton2));
        }
        this.m0.setOnClickListener(new View.OnClickListener(this) { // from class: x.cs
            public final /* synthetic */ MainActivity i;

            {
                this.i = this;
            }

            /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
            /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
            /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
            /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
            /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
            @Override // android.view.View.OnClickListener
            /*
                Code decompiled incorrectly, please refer to instructions dump.
            */
            public final void onClick(View view) {
                P8 p8;
                P8 p82;
                int i52 = i12;
                P8 p83 = null;
                P8 p84 = P8.h;
                int i62 = 3;
                P8 p85 = P8.i;
                int i72 = 2;
                P8 p86 = P8.j;
                P8 p87 = P8.k;
                int i82 = 1;
                MainActivity mainActivity = this.i;
                switch (i52) {
                    case 0:
                        char c = 1;
                        if (!mainActivity.Z) {
                            NK nk = mainActivity.p0;
                            if (nk != null) {
                                P8 p88 = nk.a;
                                if (p88 != p84 && p88 != p85) {
                                    if (p88 == p87) {
                                        p86 = p87;
                                    }
                                    mainActivity.C(p86);
                                    break;
                                } else {
                                    mainActivity.F(p88, false);
                                    break;
                                }
                            } else {
                                mainActivity.C(p86);
                                break;
                            }
                        } else {
                            String str = mainActivity.g0;
                            str.getClass();
                            switch (str.hashCode()) {
                                case -1068259517:
                                    if (!str.equals("movies")) {
                                        c = 65535;
                                        break;
                                    } else {
                                        c = 0;
                                        break;
                                    }
                                case -905838985:
                                    if (!str.equals("series")) {
                                    }
                                    break;
                                case 115183:
                                    if (str.equals("tv1")) {
                                        c = 2;
                                        break;
                                    }
                                    break;
                                case 115184:
                                    if (str.equals("tv2")) {
                                        c = 3;
                                        break;
                                    }
                                    break;
                            }
                            switch (c) {
                                case 0:
                                    p83 = p86;
                                    break;
                                case 1:
                                    p83 = p87;
                                    break;
                                case 2:
                                    p83 = p84;
                                    break;
                                case 3:
                                    p83 = p85;
                                    break;
                            }
                            if (p83 != null) {
                                if (p83 != p84 && p83 != p85) {
                                    mainActivity.C(p83);
                                    break;
                                } else {
                                    mainActivity.F(p83, false);
                                    break;
                                }
                            }
                        }
                        break;
                    case 1:
                        ScrollView scrollView2 = mainActivity.o0;
                        if (scrollView2 != null) {
                            scrollView2.smoothScrollTo(0, 0);
                            break;
                        }
                        break;
                    case 2:
                        int i92 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                        break;
                    case 3:
                        int i102 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                        break;
                    case 4:
                        int i112 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                        break;
                    case 5:
                        int i122 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                        break;
                    case 6:
                        if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                            mainActivity.A0 = true;
                            Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                            O8.i();
                            O8.h(mainActivity);
                            mainActivity.p0 = null;
                            mainActivity.x0 = false;
                            mainActivity.y0 = 0;
                            mainActivity.H();
                            mainActivity.I();
                            mainActivity.A0 = false;
                            break;
                        } else {
                            Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                            break;
                        }
                        break;
                    case 7:
                        int i132 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    case 8:
                        if (!mainActivity.Z) {
                            NK nk2 = mainActivity.p0;
                            if (nk2 != null) {
                                mainActivity.D(nk2);
                                break;
                            }
                        } else {
                            String str2 = mainActivity.g0;
                            str2.getClass();
                            switch (str2) {
                                case "movies":
                                    p8 = p86;
                                    break;
                                case "series":
                                    p8 = p87;
                                    break;
                                case "tv1":
                                    p8 = p84;
                                    break;
                                case "tv2":
                                    p8 = p85;
                                    break;
                                default:
                                    p8 = null;
                                    break;
                            }
                            if (p8 != null) {
                                if (!mainActivity.h0.isEmpty()) {
                                    ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                    int size = arrayList2.size();
                                    int i142 = 0;
                                    while (i142 < size) {
                                        Object obj = arrayList2.get(i142);
                                        i142++;
                                        C0806i9 c0806i9 = (C0806i9) obj;
                                        if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                            mainActivity.D(new NK(p8, c0806i9));
                                            break;
                                        }
                                    }
                                }
                                String str3 = mainActivity.g0;
                                str3.getClass();
                                switch (str3) {
                                    case "movies":
                                        p82 = p86;
                                        break;
                                    case "series":
                                        p82 = p87;
                                        break;
                                    case "tv1":
                                        p82 = p84;
                                        break;
                                    case "tv2":
                                        p82 = p85;
                                        break;
                                    default:
                                        p82 = null;
                                        break;
                                }
                                if (p82 != null) {
                                    if (p82 != p84 && p82 != p85) {
                                        mainActivity.C(p82);
                                        break;
                                    } else {
                                        mainActivity.F(p82, false);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        int i152 = MainActivity.B0;
                        C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                        title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                        title.a("Cancelar", null);
                        title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                        DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                        dialogInterfaceC1108o1Create.show();
                        break;
                    case 10:
                        int i162 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                        break;
                    case 11:
                        int i172 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                        break;
                    case 12:
                        int i18 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                        break;
                    case 13:
                        int i19 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                        break;
                    case 14:
                        int i20 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    default:
                        int i21 = MainActivity.B0;
                        mainActivity.getClass();
                        mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                        break;
                }
            }
        });
        this.n0.setOnClickListener(new View.OnClickListener(this) { // from class: x.cs
            public final /* synthetic */ MainActivity i;

            {
                this.i = this;
            }

            /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
            /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
            /* JADX WARN: Removed duplicated region for block: B:126:0x01ff  */
            /* JADX WARN: Removed duplicated region for block: B:22:0x00a2  */
            /* JADX WARN: Removed duplicated region for block: B:66:0x0127  */
            @Override // android.view.View.OnClickListener
            /*
                Code decompiled incorrectly, please refer to instructions dump.
            */
            public final void onClick(View view) {
                P8 p8;
                P8 p82;
                int i52 = i2;
                P8 p83 = null;
                P8 p84 = P8.h;
                int i62 = 3;
                P8 p85 = P8.i;
                int i72 = 2;
                P8 p86 = P8.j;
                P8 p87 = P8.k;
                int i82 = 1;
                MainActivity mainActivity = this.i;
                switch (i52) {
                    case 0:
                        char c = 1;
                        if (!mainActivity.Z) {
                            NK nk = mainActivity.p0;
                            if (nk != null) {
                                P8 p88 = nk.a;
                                if (p88 != p84 && p88 != p85) {
                                    if (p88 == p87) {
                                        p86 = p87;
                                    }
                                    mainActivity.C(p86);
                                    break;
                                } else {
                                    mainActivity.F(p88, false);
                                    break;
                                }
                            } else {
                                mainActivity.C(p86);
                                break;
                            }
                        } else {
                            String str = mainActivity.g0;
                            str.getClass();
                            switch (str.hashCode()) {
                                case -1068259517:
                                    if (!str.equals("movies")) {
                                        c = 65535;
                                        break;
                                    } else {
                                        c = 0;
                                        break;
                                    }
                                case -905838985:
                                    if (!str.equals("series")) {
                                    }
                                    break;
                                case 115183:
                                    if (str.equals("tv1")) {
                                        c = 2;
                                        break;
                                    }
                                    break;
                                case 115184:
                                    if (str.equals("tv2")) {
                                        c = 3;
                                        break;
                                    }
                                    break;
                            }
                            switch (c) {
                                case 0:
                                    p83 = p86;
                                    break;
                                case 1:
                                    p83 = p87;
                                    break;
                                case 2:
                                    p83 = p84;
                                    break;
                                case 3:
                                    p83 = p85;
                                    break;
                            }
                            if (p83 != null) {
                                if (p83 != p84 && p83 != p85) {
                                    mainActivity.C(p83);
                                    break;
                                } else {
                                    mainActivity.F(p83, false);
                                    break;
                                }
                            }
                        }
                        break;
                    case 1:
                        ScrollView scrollView2 = mainActivity.o0;
                        if (scrollView2 != null) {
                            scrollView2.smoothScrollTo(0, 0);
                            break;
                        }
                        break;
                    case 2:
                        int i92 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 8));
                        break;
                    case 3:
                        int i102 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, 6));
                        break;
                    case 4:
                        int i112 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, 7));
                        break;
                    case 5:
                        int i122 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, 9));
                        break;
                    case 6:
                        if (mainActivity.u0 <= 0 && !mainActivity.A0) {
                            mainActivity.A0 = true;
                            Toast.makeText(mainActivity, "Actualizando contenido…", 0).show();
                            O8.i();
                            O8.h(mainActivity);
                            mainActivity.p0 = null;
                            mainActivity.x0 = false;
                            mainActivity.y0 = 0;
                            mainActivity.H();
                            mainActivity.I();
                            mainActivity.A0 = false;
                            break;
                        } else {
                            Toast.makeText(mainActivity, "El contenido ya se está cargando", 0).show();
                            break;
                        }
                        break;
                    case 7:
                        int i132 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    case 8:
                        if (!mainActivity.Z) {
                            NK nk2 = mainActivity.p0;
                            if (nk2 != null) {
                                mainActivity.D(nk2);
                                break;
                            }
                        } else {
                            String str2 = mainActivity.g0;
                            str2.getClass();
                            switch (str2) {
                                case "movies":
                                    p8 = p86;
                                    break;
                                case "series":
                                    p8 = p87;
                                    break;
                                case "tv1":
                                    p8 = p84;
                                    break;
                                case "tv2":
                                    p8 = p85;
                                    break;
                                default:
                                    p8 = null;
                                    break;
                            }
                            if (p8 != null) {
                                if (!mainActivity.h0.isEmpty()) {
                                    ArrayList arrayList2 = p8 == p85 ? mainActivity.r0 : p8 == p86 ? mainActivity.s0 : p8 == p87 ? mainActivity.t0 : mainActivity.q0;
                                    int size = arrayList2.size();
                                    int i142 = 0;
                                    while (i142 < size) {
                                        Object obj = arrayList2.get(i142);
                                        i142++;
                                        C0806i9 c0806i9 = (C0806i9) obj;
                                        if (c0806i9 != null && mainActivity.h0.equalsIgnoreCase(c0806i9.a)) {
                                            mainActivity.D(new NK(p8, c0806i9));
                                            break;
                                        }
                                    }
                                }
                                String str3 = mainActivity.g0;
                                str3.getClass();
                                switch (str3) {
                                    case "movies":
                                        p82 = p86;
                                        break;
                                    case "series":
                                        p82 = p87;
                                        break;
                                    case "tv1":
                                        p82 = p84;
                                        break;
                                    case "tv2":
                                        p82 = p85;
                                        break;
                                    default:
                                        p82 = null;
                                        break;
                                }
                                if (p82 != null) {
                                    if (p82 != p84 && p82 != p85) {
                                        mainActivity.C(p82);
                                        break;
                                    } else {
                                        mainActivity.F(p82, false);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        int i152 = MainActivity.B0;
                        C1056n1 title = new C1056n1(mainActivity).setTitle("Desvincular dispositivo");
                        title.a.f = "¿Estás seguro de que deseas desvincular este dispositivo?";
                        title.a("Cancelar", null);
                        title.b("Sí, desvincular", new DialogInterfaceOnClickListenerC1660yj(mainActivity, i82));
                        DialogInterfaceC1108o1 dialogInterfaceC1108o1Create = title.create();
                        dialogInterfaceC1108o1Create.setOnShowListener(new DialogInterfaceOnShowListenerC1712zj(dialogInterfaceC1108o1Create, i82));
                        dialogInterfaceC1108o1Create.show();
                        break;
                    case 10:
                        int i162 = MainActivity.B0;
                        mainActivity.E(p84, new RunnableC0478bs(mainActivity, 4));
                        break;
                    case 11:
                        int i172 = MainActivity.B0;
                        mainActivity.E(p85, new RunnableC0478bs(mainActivity, i62));
                        break;
                    case 12:
                        int i18 = MainActivity.B0;
                        mainActivity.E(p86, new RunnableC0478bs(mainActivity, i72));
                        break;
                    case 13:
                        int i19 = MainActivity.B0;
                        mainActivity.E(p87, new RunnableC0478bs(mainActivity, i82));
                        break;
                    case 14:
                        int i20 = MainActivity.B0;
                        mainActivity.B();
                        break;
                    default:
                        int i21 = MainActivity.B0;
                        mainActivity.getClass();
                        mainActivity.startActivity(new Intent(mainActivity, (Class<?>) ContinueWatchingActivity.class));
                        break;
                }
            }
        });
        H();
        t();
        I();
        View viewFindViewById5 = findViewById(R.id.tvNavHome);
        Objects.requireNonNull(viewFindViewById5);
        viewFindViewById5.post(new C8(viewFindViewById5, 0));
    }

    @Override // x.W1, android.app.Activity
    public final void onDestroy() {
        M();
        super.onDestroy();
    }

    @Override // x.W1, android.app.Activity
    public final void onResume() {
        super.onResume();
        this.z0 = false;
        if (AbstractC1070nF.K(this)) {
            if (AbstractC1070nF.N(this)) {
                Intent intent = new Intent(this, (Class<?>) ExpiredActivity.class);
                intent.addFlags(335577088);
                startActivity(intent);
                finish();
                return;
            }
            G();
            I();
            if (this.J) {
                H();
            } else {
                if (this.E == null) {
                    return;
                }
                int size = E5.w(this).size();
                this.E.setVisibility(size <= 0 ? 8 : 0);
                this.F.setText(size == 1 ? "SEGUIR VIENDO · 1" : MH.e("SEGUIR VIENDO · ", size));
            }
        }
    }

    public final void s(int i, int i2, boolean z) throws IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException {
        View viewFindViewById = findViewById(i);
        if (viewFindViewById == null) {
            return;
        }
        viewFindViewById.setVisibility(0);
        viewFindViewById.setAlpha(z ? 1.0f : 0.58f);
        if (viewFindViewById instanceof MaterialCardView) {
            MaterialCardView materialCardView = (MaterialCardView) viewFindViewById;
            if (materialCardView.getChildCount() <= 0 || !(materialCardView.getChildAt(0) instanceof LinearLayout)) {
                return;
            }
            LinearLayout linearLayout = (LinearLayout) materialCardView.getChildAt(0);
            for (int i3 = 0; i3 < linearLayout.getChildCount(); i3++) {
                if (linearLayout.getChildAt(i3) instanceof ImageView) {
                    ImageView imageView = (ImageView) linearLayout.getChildAt(i3);
                    if (!z) {
                        i2 = R.drawable.ic_cochi_lock;
                    }
                    imageView.setImageResource(i2);
                    return;
                }
            }
        }
    }

    public final void t() {
        P8 p8 = P8.h;
        s(R.id.cardTv1, R.drawable.ic_cochi_monitor, AbstractC1434uG.c(p8));
        P8 p82 = P8.i;
        s(R.id.cardTv2, R.drawable.ic_cochi_monitor, AbstractC1434uG.c(p82));
        P8 p83 = P8.j;
        s(R.id.cardMovies, R.drawable.ic_cochi_movies, AbstractC1434uG.c(p83));
        P8 p84 = P8.k;
        s(R.id.cardSeries, R.drawable.ic_cochi_series, AbstractC1434uG.c(p84));
        s(R.id.cardAdult, R.drawable.ic_cochi_lock, AbstractC1434uG.b);
        x(R.id.tvNavTv1, R.drawable.ic_cochi_tv, "TV 1", AbstractC1434uG.c(p8));
        x(R.id.tvNavTv2, R.drawable.ic_cochi_monitor, "TV 2", AbstractC1434uG.c(p82));
        x(R.id.tvNavMovies, R.drawable.ic_cochi_movies, "Películas", AbstractC1434uG.c(p83));
        x(R.id.tvNavSeries, R.drawable.ic_cochi_series, "Series", AbstractC1434uG.c(p84));
        x(R.id.tvNavAdult, R.drawable.ic_cochi_lock, "Adultos", AbstractC1434uG.b);
        LinearLayout linearLayout = this.Q;
        if (linearLayout != null) {
            linearLayout.setVisibility(8);
        }
        LinearLayout linearLayout2 = this.R;
        if (linearLayout2 != null) {
            linearLayout2.setVisibility(8);
        }
        LinearLayout linearLayout3 = this.P;
        if (linearLayout3 != null) {
            linearLayout3.setVisibility(8);
        }
    }

    public final void u(NK nk) {
        String strConcat;
        String strJ;
        if (nk != null) {
            C0806i9 c0806i9 = nk.b;
            P8 p8 = nk.a;
            if (c0806i9 == null || this.Z) {
                return;
            }
            M();
            this.p0 = nk;
            String str = c0806i9.l;
            String str2 = c0806i9.j;
            String str3 = c0806i9.k;
            P8 p82 = P8.j;
            P8 p83 = P8.k;
            if (p8 == p83) {
                C0914kF c0914kFC = AbstractC0966lF.c(c0806i9.a);
                if (c0914kFC != null) {
                    List list = c0914kFC.j;
                    String str4 = c0914kFC.f;
                    String str5 = c0914kFC.e;
                    String str6 = c0914kFC.g;
                    String str7 = c0914kFC.c;
                    String str8 = c0914kFC.d;
                    if (!str8.isEmpty()) {
                        str3 = str8;
                    } else if (!str7.isEmpty()) {
                        str3 = str7;
                    }
                    if (!str6.isEmpty()) {
                        str = str6;
                    }
                    StringBuilder sb = new StringBuilder();
                    if (!str5.isEmpty()) {
                        sb.append(str5);
                    }
                    if (!str4.isEmpty()) {
                        if (sb.length() > 0) {
                            sb.append(" · ");
                        }
                        sb.append(str4);
                    }
                    if (sb.length() > 0) {
                        sb.append(" · ");
                    }
                    sb.append(list.size());
                    sb.append(list.size() == 1 ? " temporada" : " temporadas");
                    sb.append(" · ");
                    sb.append(c0914kFC.b());
                    sb.append(c0914kFC.b() == 1 ? " episodio" : " episodios");
                    strJ = sb.toString();
                } else {
                    strJ = J(str2);
                }
                strConcat = "SERIE";
            } else if (p8 == p82) {
                strJ = J(str2);
                strConcat = "PELÍCULA";
            } else {
                strConcat = "EN VIVO · ".concat(p8 == P8.i ? "TV 2" : "TV 1");
                strJ = J(str2) + " · Canal en vivo";
            }
            if (str == null || str.trim().isEmpty()) {
                str = p8 == p82 ? "Elegí reproducir para comenzar la película." : p8 == p83 ? "Abrí la serie para elegir temporada y episodio." : "Canal disponible en vivo.";
            }
            this.i0.setVisibility(0);
            this.j0.setVisibility(0);
            this.k0.setVisibility(0);
            this.l0.setVisibility(0);
            this.m0.setVisibility(0);
            this.n0.setVisibility(0);
            View view = this.X;
            if (view != null) {
                view.setVisibility(0);
            }
            this.i0.setText(strConcat);
            this.j0.setText(c0806i9.c);
            this.k0.setText(str);
            this.l0.setText(strJ);
            this.m0.setText(p8 == p83 ? "Ver serie" : "Reproducir");
            this.n0.setText("Explorar");
            if (str3 == null || str3.trim().isEmpty()) {
                this.U.setImageResource(R.drawable.cochi_tv_banner);
            } else {
                AbstractC1259qx.u(str3, this.U);
            }
        }
    }

    public final void v() {
        String strL;
        if (this.e0 != null) {
            ArrayList arrayList = this.b0;
            if (arrayList.isEmpty()) {
                return;
            }
            int i = 0;
            String str = (String) arrayList.get(Math.max(0, Math.min(this.c0, arrayList.size() - 1)));
            String strTrim = this.e0.optString("fallbackImage", "").trim();
            if (!"video".equals(this.c0 == 0 ? this.e0.optString("type", "image").toLowerCase() : "image")) {
                M();
                PlayerView playerView = this.V;
                if (playerView != null) {
                    playerView.setVisibility(8);
                }
                WebView webView = this.W;
                if (webView != null) {
                    webView.setVisibility(8);
                }
                AbstractC1259qx.u(str, this.U);
                return;
            }
            if (strTrim.isEmpty()) {
                this.U.setImageResource(R.drawable.cochi_tv_banner);
            } else {
                AbstractC1259qx.u(strTrim, this.U);
            }
            M();
            if (str == null || str.trim().isEmpty()) {
                return;
            }
            String lowerCase = str.toLowerCase(Locale.ROOT);
            if (lowerCase.contains("youtube.com/") || lowerCase.contains("youtu.be/")) {
                if (this.W == null || (strL = AbstractC1259qx.L(str)) == null || strL.trim().isEmpty()) {
                    return;
                }
                try {
                    try {
                        WebSettings settings = this.W.getSettings();
                        settings.setJavaScriptEnabled(true);
                        settings.setDomStorageEnabled(true);
                        settings.setMediaPlaybackRequiresUserGesture(false);
                        this.W.setWebChromeClient(new WebChromeClient());
                        this.W.setWebViewClient(new WebViewClient());
                        this.W.setVisibility(0);
                        String strReplaceAll = strL.replaceAll("[^A-Za-z0-9_-]", "");
                        this.W.loadDataWithBaseURL("https://www.youtube-nocookie.com", "<html><head><meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'><script src='https://www.youtube.com/iframe_api'></script></head><body style='margin:0;background:#000;overflow:hidden;position:relative'><div id='player' style='position:absolute;width:120%;height:120%;left:-10%;top:-10%'></div><script>var p;function onYouTubeIframeAPIReady(){p=new YT.Player('player',{width:'100%',height:'100%',videoId:'" + strReplaceAll + "',playerVars:{autoplay:1,controls:0,loop:1,playlist:'" + strReplaceAll + "',playsinline:1,rel:0,modestbranding:1},events:{onReady:function(e){try{e.target.setPlaybackQuality('hd1080');e.target.unMute();e.target.setVolume(100);e.target.playVideo();}catch(x){}},onStateChange:function(e){if(e.data===YT.PlayerState.ENDED){try{e.target.seekTo(0);e.target.playVideo();}catch(x){}}}}});}</script></body></html>", "text/html", "UTF-8", null);
                        return;
                    } catch (Exception unused) {
                        this.W.setVisibility(8);
                        return;
                    }
                } catch (Exception unused2) {
                    return;
                }
            }
            if (this.V == null) {
                return;
            }
            try {
                C0376Zi c0376Zi = new C0376Zi(this);
                QK.z(!c0376Zi.z);
                c0376Zi.z = true;
                C1089nj c1089nj = new C1089nj(c0376Zi);
                this.Y = c1089nj;
                this.V.setPlayer(c1089nj);
                this.V.setUseController(false);
                this.V.setVisibility(0);
                C1089nj c1089nj2 = this.Y;
                c1089nj2.c0();
                final float fH = AbstractC1595xL.h(0.0f, 0.0f, 1.0f);
                if (c1089nj2.b0 != fH) {
                    c1089nj2.b0 = fH;
                    c1089nj2.l.n.c(32, Float.valueOf(fH)).b();
                    c1089nj2.m.e(22, new InterfaceC0889jr() { // from class: x.dj
                        @Override // x.InterfaceC0889jr
                        public final void b(Object obj) {
                            ((Zx) obj).v(fH);
                        }
                    });
                }
                this.Y.U(1);
                this.Y.m.a(new C0839is(i, this));
                C1089nj c1089nj3 = this.Y;
                String strTrim2 = str.trim();
                C0934kk c0934kk = new C0934kk();
                C0475bp c0475bp = AbstractC0577dp.i;
                C1481vB c1481vB = C1481vB.l;
                List list = Collections.EMPTY_LIST;
                C1481vB c1481vB2 = C1481vB.l;
                It it = new It();
                Lt lt = Lt.a;
                Uri uri = strTrim2 == null ? null : Uri.parse(strTrim2);
                Nt nt = new Nt("", new Ht(c0934kk), uri != null ? new Kt(uri, null, null, list, c1481vB2, -9223372036854775807L) : null, new Jt(it), Rt.C, lt);
                c1089nj3.getClass();
                C1481vB c1481vBN = AbstractC0577dp.n(nt);
                c1089nj3.c0();
                ArrayList arrayList2 = new ArrayList();
                while (i < c1481vBN.k) {
                    arrayList2.add(c1089nj3.r.d((Nt) c1481vBN.get(i)));
                    i++;
                }
                c1089nj3.S(arrayList2);
                this.Y.N();
                this.Y.i();
            } catch (Exception unused3) {
                M();
            }
        }
    }

    public final void w() {
        if (this.J) {
            int iC = S6.c(this);
            int iA = S6.A(this);
            int iJ = S6.J(this);
            int iG = S6.g(this);
            int iD = S6.d(this);
            int iP = S6.P(this);
            int iL = S6.l(this, "secondary", S6.j[6]);
            getWindow().setStatusBarColor(iC);
            getWindow().setNavigationBarColor(iC);
            getWindow().getDecorView().setBackgroundColor(iC);
            View viewFindViewById = findViewById(R.id.tvHomeRoot);
            if (viewFindViewById != null) {
                viewFindViewById.setBackgroundColor(iC);
            }
            View viewFindViewById2 = findViewById(R.id.tvHomeScroll);
            if (viewFindViewById2 != null) {
                viewFindViewById2.setBackgroundColor(iC);
            }
            View viewFindViewById3 = findViewById(R.id.tvHomeSidebar);
            if (viewFindViewById3 != null) {
                GradientDrawable gradientDrawable = new GradientDrawable();
                gradientDrawable.setColor(iG);
                gradientDrawable.setCornerRadius(y(20));
                gradientDrawable.setStroke(y(1), iD);
                viewFindViewById3.setBackground(gradientDrawable);
            }
            TextView textView = (TextView) findViewById(R.id.tvBrandText);
            if (textView != null) {
                textView.setTextColor(iA);
            }
            TextView textView2 = (TextView) findViewById(R.id.welcomeText);
            if (textView2 != null) {
                textView2.setTextColor(iL);
            }
            TextView textView3 = this.H;
            if (textView3 != null) {
                textView3.setTextColor(iA);
            }
            TextView textView4 = this.G;
            if (textView4 != null) {
                textView4.setTextColor(iL);
            }
            int[] iArr = {R.id.tvNavHome, R.id.tvNavTv1, R.id.tvNavTv2, R.id.tvNavMovies, R.id.tvNavSeries, R.id.tvNavRefresh, R.id.tvNavAdult, R.id.logoutButton};
            for (int i = 0; i < 8; i++) {
                int i2 = iArr[i];
                View viewFindViewById4 = findViewById(i2);
                if (viewFindViewById4 instanceof MaterialButton) {
                    MaterialButton materialButton = (MaterialButton) viewFindViewById4;
                    materialButton.setBackgroundTintList(ColorStateList.valueOf(i2 == R.id.tvNavHome ? iJ : iG));
                    materialButton.setStrokeColor(ColorStateList.valueOf(i2 == R.id.tvNavHome ? iA : iD));
                    materialButton.setTextColor(iP);
                    materialButton.setIconTint(ColorStateList.valueOf(iA));
                }
            }
            TextView textView5 = this.i0;
            if (textView5 != null) {
                textView5.setTextColor(iA);
            }
            TextView textView6 = this.j0;
            if (textView6 != null) {
                textView6.setTextColor(iP);
            }
            TextView textView7 = this.k0;
            if (textView7 != null) {
                textView7.setTextColor(iL);
            }
            TextView textView8 = this.l0;
            if (textView8 != null) {
                textView8.setTextColor(iL);
            }
            MaterialButton materialButton2 = this.m0;
            if (materialButton2 != null) {
                materialButton2.setBackgroundTintList(ColorStateList.valueOf(iJ));
                this.m0.setStrokeColor(ColorStateList.valueOf(iA));
                this.m0.setTextColor(iP);
            }
            MaterialButton materialButton3 = this.n0;
            if (materialButton3 != null) {
                materialButton3.setBackgroundTintList(ColorStateList.valueOf(iG));
                this.n0.setStrokeColor(ColorStateList.valueOf(iD));
                this.n0.setTextColor(iP);
            }
        }
    }

    public final void x(int i, int i2, String str, boolean z) throws IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException {
        View viewFindViewById = findViewById(i);
        if (viewFindViewById instanceof MaterialButton) {
            MaterialButton materialButton = (MaterialButton) viewFindViewById;
            materialButton.setVisibility(0);
            materialButton.setTag(Boolean.valueOf(z));
            materialButton.setAlpha(z ? 1.0f : 0.92f);
            if (!z) {
                i2 = R.drawable.ic_cochi_lock;
            }
            materialButton.setIconResource(i2);
            materialButton.setText(str);
            materialButton.setBackgroundTintList(ColorStateList.valueOf(z ? S6.g(this) : getColor(R.color.cochi_locked_surface)));
            materialButton.setStrokeColor(ColorStateList.valueOf(z ? S6.d(this) : getColor(R.color.cochi_locked_border)));
            materialButton.setTextColor(S6.P(this));
            if (z) {
                materialButton.setIconTint(ColorStateList.valueOf(S6.A(this)));
            }
        }
    }

    public final int y(int i) {
        return Math.round(i * getResources().getDisplayMetrics().density);
    }
}
