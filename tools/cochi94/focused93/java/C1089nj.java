package x;

import android.content.Context;
import android.graphics.Rect;
import android.media.metrics.LogSessionId;
import android.media.metrics.MediaMetricsManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Pair;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.TextureView;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.exoplayer.image.ImageOutput;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.concurrent.CopyOnWriteArraySet;

/* renamed from: x.nj, reason: case insensitive filesystem */
/* loaded from: classes.dex */
public final class C1089nj extends Z5 implements ExoPlayer {
    public final C0991lp A;
    public final long B;
    public final Y1 C;
    public final KH D;
    public final C1467uy E;
    public final I2 F;
    public final I2 G;
    public int H;
    public boolean I;
    public int J;
    public int K;
    public boolean L;
    public boolean M;
    public AbstractC0785hp N;
    public final C1328sE O;
    public GF P;
    public Xx Q;
    public Rt R;
    public Object S;
    public Surface T;
    public SurfaceHolder U;
    public GG V;
    public boolean W;
    public TextureView X;
    public final int Y;
    public WF Z;
    public final C0749h4 a0;
    public final C0558dK b;
    public float b0;
    public final Xx c;
    public boolean c0;
    public final C1081nb d;
    public C0314Vc d0;
    public final Context e;
    public final boolean e0;
    public final C1089nj f;
    public boolean f0;
    public final AbstractC0389a6[] g;
    public final int g0;
    public final AbstractC0389a6[] h;
    public boolean h0;
    public final AbstractC1472v2 i;
    public C1129oM i0;
    public final C1696zI j;
    public final long j0;
    public final C0675fj k;
    public final long k0;
    public final C1504vj l;
    public final long l0;
    public final C1045mr m;
    public Rt m0;
    public final CopyOnWriteArraySet n;
    public Jx n0;
    public final C0970lJ o;
    public int o0;
    public final ArrayList p;
    public long p0;
    public final boolean q;
    public final InterfaceC0428au r;
    public final C0371Zd s;
    public final Looper t;
    public final I5 u;
    public final C1592xI v;
    public final SurfaceHolderCallbackC0881jj w;

    /* renamed from: x, reason: collision with root package name */
    public final C0933kj f89x;
    public final C0851j4 y;
    public final C1597xN z;

    static {
        Ot.a("media3.exoplayer");
    }

    public C1089nj(C0376Zi c0376Zi) {
        C0376Zi c0376Zi2;
        C1467uy c1467uy;
        Looper looper = c0376Zi.h;
        W1 w1 = c0376Zi.a;
        int i = 0;
        this.d = new C1081nb();
        try {
            AbstractC1578x4.H("Init " + Integer.toHexString(System.identityHashCode(this)) + " [AndroidXMedia3/1.11.0] [" + AbstractC1595xL.a + "]");
            C1592xI c1592xI = c0376Zi.b;
            this.e = w1.getApplicationContext();
            this.s = new C0371Zd(c1592xI);
            this.g0 = c0376Zi.i;
            this.a0 = c0376Zi.j;
            this.Y = c0376Zi.k;
            this.c0 = false;
            this.B = c0376Zi.t;
            SurfaceHolderCallbackC0881jj surfaceHolderCallbackC0881jj = new SurfaceHolderCallbackC0881jj(this);
            this.w = surfaceHolderCallbackC0881jj;
            this.f89x = new C0933kj();
            AbstractC0389a6[] abstractC0389a6ArrG = ((I2) c0376Zi.c.get()).g(new Handler(looper), surfaceHolderCallbackC0881jj, surfaceHolderCallbackC0881jj, surfaceHolderCallbackC0881jj, surfaceHolderCallbackC0881jj);
            this.g = abstractC0389a6ArrG;
            QK.z(abstractC0389a6ArrG.length > 0);
            this.h = new AbstractC0389a6[abstractC0389a6ArrG.length];
            int i2 = 0;
            while (true) {
                AbstractC0389a6[] abstractC0389a6Arr = this.h;
                if (i2 >= abstractC0389a6Arr.length) {
                    break;
                }
                int i3 = this.g[i2].i;
                abstractC0389a6Arr[i2] = null;
                i2++;
            }
            AbstractC1472v2 abstractC1472v2 = (AbstractC1472v2) c0376Zi.e.get();
            this.i = abstractC1472v2;
            this.r = (InterfaceC0428au) c0376Zi.d.get();
            I5 i5 = (I5) c0376Zi.g.get();
            this.u = i5;
            this.q = c0376Zi.l;
            C1640yE c1640yE = c0376Zi.m;
            this.j0 = c0376Zi.o;
            this.k0 = c0376Zi.p;
            this.l0 = c0376Zi.q;
            this.O = c0376Zi.n;
            this.t = looper;
            this.v = c1592xI;
            this.f = this;
            this.m = new C1045mr(new CopyOnWriteArraySet(), looper, looper.getThread(), c1592xI, new C0343Xd(this), true);
            CopyOnWriteArraySet copyOnWriteArraySet = new CopyOnWriteArraySet();
            this.n = copyOnWriteArraySet;
            this.p = new ArrayList();
            this.P = new GF();
            AbstractC0389a6[] abstractC0389a6Arr2 = this.g;
            C0558dK c0558dK = new C0558dK(new GB[abstractC0389a6Arr2.length], new InterfaceC1608xj[abstractC0389a6Arr2.length], C0661fK.b, null);
            this.b = c0558dK;
            this.o = new C0970lJ();
            Wx wx = new Wx();
            N6 n6 = wx.a;
            int[] iArr = {1, 2, 3, 13, 14, 15, 16, 17, 18, 19, 31, 20, 30, 21, 35, 22, 24, 27, 28, 32};
            n6.getClass();
            for (int i4 = 20; i < i4; i4 = 20) {
                n6.a(iArr[i]);
                i++;
            }
            wx.a(29, true);
            wx.a(23, false);
            wx.a(25, false);
            wx.a(33, false);
            wx.a(26, false);
            wx.a(34, false);
            C1090nk c1090nkB = n6.b();
            this.c = new Xx(c1090nkB);
            N6 n62 = new Wx().a;
            n62.getClass();
            for (int i6 = 0; i6 < c1090nkB.a.size(); i6++) {
                n62.a(c1090nkB.a(i6));
            }
            n62.a(4);
            n62.a(10);
            this.Q = new Xx(n62.b());
            this.j = c1592xI.a(looper, null);
            C0675fj c0675fj = new C0675fj(this);
            this.k = c0675fj;
            this.n0 = Jx.k(c0558dK);
            this.s.T(this, looper);
            final Py py = new Py(c0376Zi.A);
            C1504vj c1504vj = new C1504vj(this.e, this.g, this.h, abstractC1472v2, c0558dK, (InterfaceC1356sr) c0376Zi.f.get(), i5, this.H, this.I, this.s, c1640yE, c0376Zi.r, c0376Zi.s, c0376Zi.B, looper, c1592xI, c0675fj, py, this.f89x, c0376Zi.C);
            C1696zI c1696zI = c1504vj.n;
            this.l = c1504vj;
            Looper looper2 = c1504vj.p;
            this.b0 = 1.0f;
            this.H = 0;
            Rt rt = Rt.C;
            this.R = rt;
            this.m0 = rt;
            this.o0 = -1;
            this.d0 = C0314Vc.c;
            this.e0 = true;
            C0371Zd c0371Zd = this.s;
            C1045mr c1045mr = this.m;
            c0371Zd.getClass();
            c1045mr.a(c0371Zd);
            i5.a(new Handler(looper), this.s);
            copyOnWriteArraySet.add(this.w);
            int i7 = Build.VERSION.SDK_INT;
            if (i7 >= 31) {
                final Context context = this.e;
                c0376Zi2 = c0376Zi;
                final boolean z = c0376Zi2.y;
                c1467uy = null;
                c1592xI.a(c1504vj.p, null).e(new Runnable() { // from class: x.ij
                    @Override // java.lang.Runnable
                    public final void run() {
                        Context context2 = context;
                        boolean z2 = z;
                        C1089nj c1089nj = this;
                        Py py2 = py;
                        MediaMetricsManager mediaMetricsManagerA = St.a(context2.getSystemService("media_metrics"));
                        Ut ut = mediaMetricsManagerA == null ? null : new Ut(context2, mediaMetricsManagerA.createPlaybackSession());
                        if (ut == null) {
                            AbstractC1578x4.f0("ExoPlayerImpl", "MediaMetricsService unavailable.");
                            return;
                        }
                        if (z2) {
                            C0371Zd c0371Zd2 = c1089nj.s;
                            c0371Zd2.getClass();
                            c0371Zd2.m.a(ut);
                        }
                        LogSessionId sessionId = ut.d.getSessionId();
                        synchronized (py2) {
                            C1044mq c1044mq = py2.b;
                            c1044mq.getClass();
                            LogSessionId logSessionId = (LogSessionId) c1044mq.i;
                            LogSessionId unused = LogSessionId.LOG_SESSION_ID_NONE;
                            QK.z(logSessionId.equals(LogSessionId.LOG_SESSION_ID_NONE));
                            c1044mq.i = sessionId;
                        }
                    }
                });
            } else {
                c0376Zi2 = c0376Zi;
                c1467uy = null;
            }
            Y1 y1 = new Y1(0, looper2, looper, c1592xI, new C0675fj(this));
            this.C = y1;
            y1.k(new N0(22, this));
            C0376Zi c0376Zi3 = c0376Zi2;
            C1467uy c1467uy2 = c1467uy;
            C0851j4 c0851j4 = new C0851j4(w1, looper2, c0376Zi3.h, this.w, c1592xI);
            this.y = c0851j4;
            c0851j4.e();
            boolean z2 = (c0376Zi3.u == Integer.MAX_VALUE || c0376Zi3.v == Integer.MAX_VALUE || c0376Zi3.w == Integer.MAX_VALUE || c0376Zi3.f64x == Integer.MAX_VALUE) ? false : true;
            C1597xN c1597xN = new C1597xN(w1, looper2, c1592xI);
            this.z = c1597xN;
            if (c1597xN.d != z2) {
                c1597xN.d = z2;
                c1597xN.a(z2, c1597xN.e);
            }
            this.A = new C0991lp(w1, looper2, c1592xI);
            int i8 = C0466bg.c;
            this.i0 = C1129oM.d;
            this.Z = WF.c;
            this.E = i7 >= 34 ? new C1467uy(this, w1) : c1467uy2;
            this.F = new I2(25);
            this.G = new I2(25);
            this.D = new KH(this, this.w, this.v, c0376Zi3.u, c0376Zi3.v, c0376Zi3.w, c0376Zi3.f64x);
            c1696zI.c(38, this.O).b();
            C0749h4 c0749h4 = this.a0;
            c1696zI.getClass();
            C1644yI c1644yID = C1696zI.d();
            c1644yID.a = c1696zI.a.obtainMessage(31, 0, 0, c0749h4);
            c1644yID.b();
            R(1, 3, this.a0);
            R(2, 4, Integer.valueOf(this.Y));
            R(2, 5, 0);
            R(1, 9, Boolean.valueOf(this.c0));
            R(6, 8, this.f89x);
            R(-1, 16, Integer.valueOf(this.g0));
            this.d.e();
        } catch (Throwable th) {
            this.d.e();
            throw th;
        }
    }

    public static long G(Jx jx) {
        C1022mJ c1022mJ = new C1022mJ();
        C0970lJ c0970lJ = new C0970lJ();
        jx.a.g(jx.b.a, c0970lJ);
        long j = jx.c;
        return j == -9223372036854775807L ? jx.a.m(c0970lJ.c, c1022mJ, 0L).l : c0970lJ.e + j;
    }

    public static Jx J(Jx jx, int i) {
        Jx jxH = jx.h(i);
        return (i == 1 || i == 4) ? jxH.b(false) : jxH;
    }

    public final C0661fK A() {
        c0();
        return (C0661fK) this.n0.i.l;
    }

    public final int B(Jx jx) {
        return jx.a.p() ? this.o0 : jx.a.g(jx.b.a, this.o).c;
    }

    public final long C() {
        c0();
        if (!I()) {
            return b();
        }
        Jx jx = this.n0;
        C0480bu c0480bu = jx.b;
        AbstractC1074nJ abstractC1074nJ = jx.a;
        Object obj = c0480bu.a;
        C0970lJ c0970lJ = this.o;
        abstractC1074nJ.g(obj, c0970lJ);
        return AbstractC1595xL.c0(c0970lJ.a(c0480bu.b, c0480bu.c));
    }

    public final boolean D() {
        c0();
        return this.n0.l;
    }

    public final int E() {
        c0();
        return this.n0.e;
    }

    public final int F() {
        c0();
        return this.n0.n;
    }

    public final C0455bK H() {
        c0();
        C0050Df c0050Df = ((C0125If) this.i).e;
        if (!this.M) {
            return c0050Df;
        }
        c0050Df.getClass();
        C0035Cf c0035Cf = new C0035Cf(c0050Df);
        c0035Cf.j(this.N);
        return new C0050Df(c0035Cf);
    }

    public final boolean I() {
        c0();
        return this.n0.b.c();
    }

    public final Jx K(Jx jx, AbstractC1074nJ abstractC1074nJ, Pair pair) {
        List list;
        QK.k(abstractC1074nJ.p() || pair != null);
        AbstractC1074nJ abstractC1074nJ2 = jx.a;
        long jS = s(jx);
        Jx jxJ = jx.j(abstractC1074nJ);
        if (abstractC1074nJ.p()) {
            C0480bu c0480bu = Jx.u;
            long jP = AbstractC1595xL.P(this.p0);
            Jx jxC = jxJ.d(c0480bu, jP, jP, jP, 0L, TJ.d, this.b, C1481vB.l).c(c0480bu);
            jxC.q = jxC.s;
            return jxC;
        }
        Object obj = jxJ.b.a;
        boolean zEquals = obj.equals(pair.first);
        C0480bu c0480bu2 = !zEquals ? new C0480bu(pair.first) : jxJ.b;
        long jLongValue = ((Long) pair.second).longValue();
        long jP2 = AbstractC1595xL.P(jS);
        if (!abstractC1074nJ2.p()) {
            jP2 -= abstractC1074nJ2.g(obj, this.o).e;
            if (zEquals && jP2 - jLongValue == 1 && jP2 == abstractC1074nJ2.g(obj, this.o).d) {
                jP2--;
            }
        }
        if (!zEquals || jLongValue < jP2) {
            C0480bu c0480bu3 = c0480bu2;
            QK.z(!c0480bu3.c());
            TJ tj = !zEquals ? TJ.d : jxJ.h;
            C0558dK c0558dK = !zEquals ? this.b : jxJ.i;
            if (zEquals) {
                list = jxJ.j;
            } else {
                C0475bp c0475bp = AbstractC0577dp.i;
                list = C1481vB.l;
            }
            Jx jxC2 = jxJ.d(c0480bu3, jLongValue, jLongValue, jLongValue, 0L, tj, c0558dK, list).c(c0480bu3);
            jxC2.q = jLongValue;
            return jxC2;
        }
        if (jLongValue != jP2) {
            C0480bu c0480bu4 = c0480bu2;
            QK.z(!c0480bu4.c());
            long jMax = Math.max(0L, jxJ.r - (jLongValue - jP2));
            long j = jxJ.q;
            if (jxJ.k.equals(jxJ.b)) {
                j = jLongValue + jMax;
            }
            Jx jxD = jxJ.d(c0480bu4, jLongValue, jLongValue, jLongValue, jMax, jxJ.h, jxJ.i, jxJ.j);
            jxD.q = j;
            return jxD;
        }
        int iB = abstractC1074nJ.b(jxJ.k.a);
        if (iB != -1 && abstractC1074nJ.f(iB, this.o, false).c == abstractC1074nJ.g(c0480bu2.a, this.o).c) {
            return jxJ;
        }
        abstractC1074nJ.g(c0480bu2.a, this.o);
        long jA = c0480bu2.c() ? this.o.a(c0480bu2.b, c0480bu2.c) : this.o.d;
        C0480bu c0480bu5 = c0480bu2;
        Jx jxC3 = jxJ.d(c0480bu5, jxJ.s, jxJ.s, jxJ.d, jA - jxJ.s, jxJ.h, jxJ.i, jxJ.j).c(c0480bu5);
        jxC3.q = jA;
        return jxC3;
    }

    public final Pair L(AbstractC1074nJ abstractC1074nJ, int i, long j) {
        if (abstractC1074nJ.p()) {
            this.o0 = i;
            if (j == -9223372036854775807L) {
                j = 0;
            }
            this.p0 = j;
            return null;
        }
        if (i == -1 || i >= abstractC1074nJ.o()) {
            i = abstractC1074nJ.a(this.I);
            j = AbstractC1595xL.c0(abstractC1074nJ.m(i, (C1022mJ) this.a, 0L).l);
        }
        return abstractC1074nJ.i((C1022mJ) this.a, this.o, i, AbstractC1595xL.P(j));
    }

    public final void M(final int i, final int i2) {
        WF wf = this.Z;
        if (i == wf.a && i2 == wf.b) {
            return;
        }
        this.Z = new WF(i, i2);
        this.m.e(24, new InterfaceC0889jr() { // from class: x.ej
            @Override // x.InterfaceC0889jr
            public final void b(Object obj) {
                ((Zx) obj).H(i, i2);
            }
        });
        R(2, 14, new WF(i, i2));
    }

    public final void N() {
        c0();
        Jx jx = this.n0;
        if (jx.e != 1) {
            return;
        }
        Jx jxF = jx.f(null);
        Jx jxJ = J(jxF, jxF.a.p() ? 4 : 2);
        this.J++;
        this.l.n.a(29).b();
        a0(jxJ, 1, false, 5, -9223372036854775807L, -1, false);
    }

    public final void O() {
        String str;
        boolean zC;
        Context context;
        StringBuilder sb = new StringBuilder("Release ");
        sb.append(Integer.toHexString(System.identityHashCode(this)));
        sb.append(" [AndroidXMedia3/1.11.0] [");
        sb.append(AbstractC1595xL.a);
        sb.append("] [");
        HashSet hashSet = Ot.a;
        synchronized (Ot.class) {
            str = Ot.b;
        }
        sb.append(str);
        sb.append("]");
        AbstractC1578x4.H(sb.toString());
        c0();
        this.y.e();
        this.z.b(false);
        this.A.a(false);
        C1467uy c1467uy = this.E;
        if (c1467uy != null && Build.VERSION.SDK_INT >= 34 && (context = (Context) ((WeakReference) c1467uy.i).get()) != null) {
            context.unregisterDeviceIdChangeListener((C1037mj) c1467uy.j);
        }
        KH kh = this.D;
        kh.f.f();
        kh.a.P(kh.b);
        C1504vj c1504vj = this.l;
        if (c1504vj.Q || !c1504vj.p.getThread().isAlive()) {
            zC = true;
        } else {
            c1504vj.Q = true;
            C1081nb c1081nb = new C1081nb(c1504vj.v);
            c1504vj.n.c(7, c1081nb).b();
            zC = c1081nb.c(c1504vj.A);
        }
        if (!zC) {
            this.m.e(10, new C0343Xd(16));
        }
        this.m.d();
        this.j.f();
        this.u.c(this.s);
        Jx jx = this.n0;
        if (jx.p) {
            this.n0 = jx.a();
        }
        Jx jxJ = J(this.n0, 1);
        this.n0 = jxJ;
        Jx jxC = jxJ.c(jxJ.b);
        this.n0 = jxC;
        jxC.q = jxC.s;
        this.n0.r = 0L;
        C0371Zd c0371Zd = this.s;
        C1696zI c1696zI = c0371Zd.o;
        c1696zI.getClass();
        c1696zI.e(new N0(14, c0371Zd));
        Q();
        Surface surface = this.T;
        if (surface != null) {
            surface.release();
            this.T = null;
        }
        this.d0 = C0314Vc.c;
        this.h0 = true;
        if (this.n0.a.p()) {
            return;
        }
        Jx jx2 = this.n0;
        boolean z = jx2.a.b(jx2.b.a) != -1;
        Locale locale = Locale.US;
        Jx jx3 = this.n0;
        QK.y(String.format(locale, "periodUid %s not found in timeline %s with size %d", jx3.b.a, jx3.a.getClass().getName(), Integer.valueOf(this.n0.a.o())), z);
    }

    public final void P(Zx zx) {
        c0();
        zx.getClass();
        C1045mr c1045mr = this.m;
        if (c1045mr.i) {
            QK.z(Thread.currentThread() == c1045mr.a);
        }
        CopyOnWriteArraySet copyOnWriteArraySet = c1045mr.d;
        Iterator it = copyOnWriteArraySet.iterator();
        while (it.hasNext()) {
            C0993lr c0993lr = (C0993lr) it.next();
            if (c0993lr.a.equals(zx)) {
                InterfaceC0941kr interfaceC0941kr = c1045mr.c;
                c0993lr.d = true;
                if (interfaceC0941kr != null && c0993lr.c) {
                    c0993lr.c = false;
                    interfaceC0941kr.d(c0993lr.a, c0993lr.b.b());
                }
                copyOnWriteArraySet.remove(c0993lr);
            }
        }
    }

    public final void Q() {
        GG gg = this.V;
        SurfaceHolderCallbackC0881jj surfaceHolderCallbackC0881jj = this.w;
        if (gg != null) {
            Sy syQ = q(this.f89x);
            QK.z(!syQ.f);
            syQ.c = 10000;
            QK.z(!syQ.f);
            syQ.d = null;
            syQ.b();
            this.V.h.remove(surfaceHolderCallbackC0881jj);
            this.V = null;
        }
        TextureView textureView = this.X;
        if (textureView != null) {
            if (textureView.getSurfaceTextureListener() != surfaceHolderCallbackC0881jj) {
                AbstractC1578x4.f0("ExoPlayerImpl", "SurfaceTextureListener already unset or replaced.");
            } else {
                this.X.setSurfaceTextureListener(null);
            }
            this.X = null;
        }
        SurfaceHolder surfaceHolder = this.U;
        if (surfaceHolder != null) {
            surfaceHolder.removeCallback(surfaceHolderCallbackC0881jj);
            this.U = null;
        }
    }

    public final void R(int i, int i2, Object obj) {
        for (AbstractC0389a6 abstractC0389a6 : this.g) {
            if (i == -1 || abstractC0389a6.i == i) {
                Sy syQ = q(abstractC0389a6);
                QK.z(!syQ.f);
                syQ.c = i2;
                QK.z(!syQ.f);
                syQ.d = obj;
                syQ.b();
            }
        }
        for (AbstractC0389a6 abstractC0389a62 : this.h) {
            if (abstractC0389a62 != null && (i == -1 || abstractC0389a62.i == i)) {
                Sy syQ2 = q(abstractC0389a62);
                QK.z(!syQ2.f);
                syQ2.c = i2;
                QK.z(!syQ2.f);
                syQ2.d = obj;
                syQ2.b();
            }
        }
    }

    /* JADX WARN: Removed duplicated region for block: B:17:0x009c  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void S(List list) {
        c0();
        B(this.n0);
        x();
        this.J++;
        ArrayList arrayList = this.p;
        arrayList.clear();
        ArrayList arrayList2 = new ArrayList();
        for (int i = 0; i < list.size(); i++) {
            C1307ru c1307ru = new C1307ru((Y5) list.get(i), this.q);
            arrayList2.add(c1307ru);
            arrayList.add(i, new C0985lj(c1307ru.b, c1307ru.a));
        }
        GF gf = this.P;
        int size = arrayList2.size();
        gf.getClass();
        this.P = new GF(new Random(gf.a.nextLong())).a(size);
        C0433az c0433az = new C0433az(arrayList, this.P);
        boolean zP = c0433az.p();
        int i2 = c0433az.d;
        if (!zP && -1 >= i2) {
            throw new C0029Bo();
        }
        int iA = c0433az.a(this.I);
        Jx jxK = K(this.n0, c0433az, L(c0433az, iA, -9223372036854775807L));
        int i3 = jxK.e;
        if (i3 == 1) {
            i3 = 1;
        } else if (!c0433az.p()) {
            if (iA != -1) {
                i3 = iA >= i2 ? 4 : 2;
            }
        }
        Jx jxJ = J(jxK, i3);
        this.l.n.c(17, new C1296rj(arrayList2, this.P, iA, AbstractC1595xL.P(-9223372036854775807L))).b();
        a0(jxJ, 0, (this.n0.b.a.equals(jxJ.b.a) || this.n0.a.p()) ? false : true, 4, y(jxJ), -1, false);
    }

    public final void T(SurfaceHolder surfaceHolder) {
        this.W = false;
        this.U = surfaceHolder;
        surfaceHolder.addCallback(this.w);
        Surface surface = this.U.getSurface();
        if (surface == null || !surface.isValid()) {
            M(0, 0);
        } else {
            Rect surfaceFrame = this.U.getSurfaceFrame();
            M(surfaceFrame.width(), surfaceFrame.height());
        }
    }

    public final void U(int i) {
        c0();
        if (this.H != i) {
            this.H = i;
            this.l.n.b(11, i, 0).b();
            C0301Ud c0301Ud = new C0301Ud(i, 1);
            C1045mr c1045mr = this.m;
            c1045mr.c(8, c0301Ud);
            Y();
            c1045mr.b();
        }
    }

    public final void V(C0455bK c0455bK) {
        C0455bK c0455bKA;
        c0();
        AbstractC1472v2 abstractC1472v2 = this.i;
        abstractC1472v2.getClass();
        C0455bK c0455bKH = H();
        if (this.M) {
            this.N = c0455bK.w;
            AbstractC0785hp abstractC0785hp = this.O.a;
            C0403aK c0403aKA = c0455bK.a();
            AbstractC0818iL it = abstractC0785hp.iterator();
            while (it.hasNext()) {
                c0403aKA.i(((Integer) it.next()).intValue(), true);
            }
            c0455bKA = c0403aKA.a();
        } else {
            c0455bKA = c0455bK;
        }
        C0125If c0125If = (C0125If) abstractC1472v2;
        if (!c0455bKA.equals(c0125If.e)) {
            if (c0455bKA instanceof C0050Df) {
                c0125If.u((C0050Df) c0455bKA);
            }
            C0035Cf c0035Cf = new C0035Cf(c0125If.e);
            c0035Cf.c(c0455bKA);
            c0125If.u(new C0050Df(c0035Cf));
        }
        if (c0455bKH.equals(c0455bK)) {
            return;
        }
        this.m.e(19, new C0802i5(12, c0455bK));
    }

    public final void W(Object obj) {
        Object obj2 = this.S;
        boolean zC = true;
        boolean z = (obj2 == null || obj2 == obj) ? false : true;
        long j = z ? this.B : -9223372036854775807L;
        C1504vj c1504vj = this.l;
        if (!c1504vj.Q && c1504vj.p.getThread().isAlive()) {
            C1081nb c1081nb = new C1081nb(c1504vj.v);
            c1504vj.n.c(30, new Pair(obj, c1081nb)).b();
            if (j != -9223372036854775807L) {
                zC = c1081nb.c(j);
            }
        }
        if (z) {
            Object obj3 = this.S;
            Surface surface = this.T;
            if (obj3 == surface) {
                surface.release();
                this.T = null;
            }
        }
        this.S = obj;
        if (zC) {
            return;
        }
        X(new C0348Xi(2, new C0210Oa("Detaching surface timed out."), 1003));
    }

    public final void X(C0348Xi c0348Xi) {
        Jx jx = this.n0;
        Jx jxC = jx.c(jx.b);
        jxC.q = jxC.s;
        jxC.r = 0L;
        Jx jxJ = J(jxC, 1);
        if (c0348Xi != null) {
            jxJ = jxJ.f(c0348Xi);
        }
        this.J++;
        this.l.n.a(6).b();
        a0(jxJ, 0, false, 5, -9223372036854775807L, -1, false);
    }

    public final void Y() {
        int iK;
        int iE;
        Xx xx = this.Q;
        String str = AbstractC1595xL.a;
        C1089nj c1089nj = this.f;
        boolean zI = c1089nj.I();
        boolean zG = c1089nj.g();
        AbstractC1074nJ abstractC1074nJZ = c1089nj.z();
        boolean z = false;
        if (abstractC1074nJZ.p()) {
            iK = -1;
        } else {
            int iV = c1089nj.v();
            c1089nj.c0();
            int i = c1089nj.H;
            if (i == 1) {
                i = 0;
            }
            c1089nj.c0();
            iK = abstractC1074nJZ.k(iV, i, c1089nj.I);
        }
        boolean z2 = iK != -1;
        AbstractC1074nJ abstractC1074nJZ2 = c1089nj.z();
        if (abstractC1074nJZ2.p()) {
            iE = -1;
        } else {
            int iV2 = c1089nj.v();
            c1089nj.c0();
            int i2 = c1089nj.H;
            if (i2 == 1) {
                i2 = 0;
            }
            c1089nj.c0();
            iE = abstractC1074nJZ2.e(iV2, i2, c1089nj.I);
        }
        boolean z3 = iE != -1;
        boolean zF = c1089nj.f();
        boolean zE = c1089nj.e();
        boolean zP = c1089nj.z().p();
        Wx wx = new Wx();
        C1090nk c1090nk = this.c.a;
        N6 n6 = wx.a;
        n6.getClass();
        for (int i3 = 0; i3 < c1090nk.a.size(); i3++) {
            n6.a(c1090nk.a(i3));
        }
        boolean z4 = !zI;
        wx.a(4, z4);
        wx.a(5, zG && !zI);
        wx.a(6, z2 && !zI);
        wx.a(7, !zP && (z2 || !zF || zG) && !zI);
        wx.a(8, z3 && !zI);
        wx.a(9, !zP && (z3 || (zF && zE)) && !zI);
        wx.a(10, z4);
        wx.a(11, zG && !zI);
        if (zG && !zI) {
            z = true;
        }
        wx.a(12, z);
        Xx xx2 = new Xx(n6.b());
        this.Q = xx2;
        if (xx2.equals(xx)) {
            return;
        }
        this.m.c(13, new C0675fj(this));
    }

    public final void Z(int i, boolean z) {
        int i2 = this.M ? 4 : (this.n0.n != 1 || z) ? 0 : 1;
        Jx jxA = this.n0;
        if (jxA.l == z && jxA.n == i2 && jxA.m == i) {
            return;
        }
        this.J++;
        if (jxA.p) {
            jxA = jxA.a();
        }
        Jx jxE = jxA.e(i, i2, z);
        this.l.n.b(1, z ? 1 : 0, i | (i2 << 4)).b();
        a0(jxE, 0, false, 5, -9223372036854775807L, -1, false);
    }

    public final void a0(final Jx jx, int i, boolean z, final int i2, long j, int i3, boolean z2) {
        int i4;
        Pair pair;
        int i5;
        Nt nt;
        int i6;
        boolean z3;
        boolean z4;
        int i7;
        int i8;
        Object obj;
        Nt nt2;
        Object obj2;
        long j2;
        long j3;
        long jG;
        long jG2;
        Object obj3;
        Nt nt3;
        Object obj4;
        Jx jx2 = this.n0;
        this.n0 = jx;
        if (!jx.a.p()) {
            QK.y(String.format(Locale.US, "periodUid %s not found in timeline %s with size %d", jx.b.a, jx.a.getClass().getName(), Integer.valueOf(jx.a.o())), jx.a.b(jx.b.a) != -1);
        }
        boolean zEquals = jx2.a.equals(jx.a);
        C1022mJ c1022mJ = (C1022mJ) this.a;
        C0970lJ c0970lJ = this.o;
        AbstractC1074nJ abstractC1074nJ = jx2.a;
        C0480bu c0480bu = jx2.b;
        AbstractC1074nJ abstractC1074nJ2 = jx.a;
        C0480bu c0480bu2 = jx.b;
        if (abstractC1074nJ2.p() && abstractC1074nJ.p()) {
            pair = new Pair(Boolean.FALSE, -1);
            i4 = 0;
        } else {
            i4 = 0;
            if (abstractC1074nJ2.p() != abstractC1074nJ.p()) {
                pair = new Pair(Boolean.TRUE, 3);
            } else if (abstractC1074nJ.m(abstractC1074nJ.g(c0480bu.a, c0970lJ).c, c1022mJ, 0L).a.equals(abstractC1074nJ2.m(abstractC1074nJ2.g(c0480bu2.a, c0970lJ).c, c1022mJ, 0L).a)) {
                pair = (z && i2 == 0 && c0480bu.d < c0480bu2.d) ? new Pair(Boolean.TRUE, 0) : (z && i2 == 1 && z2) ? new Pair(Boolean.TRUE, 2) : new Pair(Boolean.FALSE, -1);
            } else {
                if (z && i2 == 0) {
                    i5 = 1;
                } else if (z && i2 == 1) {
                    i5 = 2;
                } else {
                    if (zEquals) {
                        throw new IllegalStateException();
                    }
                    i5 = 3;
                }
                pair = new Pair(Boolean.TRUE, Integer.valueOf(i5));
            }
        }
        boolean zBooleanValue = ((Boolean) pair.first).booleanValue();
        int iIntValue = ((Integer) pair.second).intValue();
        if (zBooleanValue) {
            nt = !jx.a.p() ? jx.a.m(jx.a.g(jx.b.a, this.o).c, (C1022mJ) this.a, 0L).c : null;
            this.m0 = Rt.C;
        } else {
            nt = null;
        }
        if (zBooleanValue || !jx2.j.equals(jx.j)) {
            Qt qtA = this.m0.a();
            List list = jx.j;
            for (int i9 = i4; i9 < list.size(); i9++) {
                C0429av c0429av = (C0429av) list.get(i9);
                int i10 = i4;
                while (true) {
                    Zu[] zuArr = c0429av.a;
                    if (i10 < zuArr.length) {
                        zuArr[i10].a(qtA);
                        i10++;
                    }
                }
            }
            this.m0 = new Rt(qtA);
        }
        Rt rtO = o();
        boolean zEquals2 = rtO.equals(this.R);
        this.R = rtO;
        int i11 = jx2.l != jx.l ? 1 : i4;
        int i12 = jx2.e != jx.e ? 1 : i4;
        if (i12 != 0 || i11 != 0) {
            b0();
        }
        int i13 = jx2.g != jx.g ? 1 : i4;
        if (!zEquals) {
            int i14 = i4;
            this.m.c(i14, new C0469bj(i, i14, jx));
        }
        if (z) {
            C0970lJ c0970lJ2 = new C0970lJ();
            if (jx2.a.p()) {
                i6 = i11;
                z3 = zEquals2;
                z4 = zBooleanValue;
                i7 = i3;
                i8 = i7;
                obj = null;
                nt2 = null;
                obj2 = null;
            } else {
                Object obj5 = jx2.b.a;
                jx2.a.g(obj5, c0970lJ2);
                int i15 = c0970lJ2.c;
                int iB = jx2.a.b(obj5);
                i6 = i11;
                z3 = zEquals2;
                z4 = zBooleanValue;
                obj = jx2.a.m(i15, (C1022mJ) this.a, 0L).a;
                nt2 = ((C1022mJ) this.a).c;
                obj2 = obj5;
                i7 = i15;
                i8 = iB;
            }
            if (i2 == 0) {
                if (jx2.b.c()) {
                    C0480bu c0480bu3 = jx2.b;
                    jG = c0970lJ2.a(c0480bu3.b, c0480bu3.c);
                    jG2 = G(jx2);
                } else if (jx2.b.e != -1) {
                    jG = G(this.n0);
                    jG2 = jG;
                } else {
                    j2 = c0970lJ2.e;
                    j3 = c0970lJ2.d;
                    jG = j2 + j3;
                    jG2 = jG;
                }
            } else if (jx2.b.c()) {
                jG = jx2.s;
                jG2 = G(jx2);
            } else {
                j2 = c0970lJ2.e;
                j3 = jx2.s;
                jG = j2 + j3;
                jG2 = jG;
            }
            long jC0 = AbstractC1595xL.c0(jG);
            long jC02 = AbstractC1595xL.c0(jG2);
            C0480bu c0480bu4 = jx2.b;
            final C0432ay c0432ay = new C0432ay(obj, i7, nt2, obj2, i8, jC0, jC02, c0480bu4.b, c0480bu4.c);
            C1022mJ c1022mJ2 = (C1022mJ) this.a;
            int iV = v();
            int iW = w();
            if (this.n0.a.p()) {
                obj3 = null;
                nt3 = null;
                obj4 = null;
            } else {
                Jx jx3 = this.n0;
                Object obj6 = jx3.b.a;
                jx3.a.g(obj6, this.o);
                iW = this.n0.a.b(obj6);
                Object obj7 = this.n0.a.m(iV, c1022mJ2, 0L).a;
                nt3 = c1022mJ2.c;
                obj4 = obj6;
                obj3 = obj7;
            }
            int i16 = iW;
            long jC03 = AbstractC1595xL.c0(j);
            long jC04 = this.n0.b.c() ? AbstractC1595xL.c0(G(this.n0)) : jC03;
            C0480bu c0480bu5 = this.n0.b;
            final C0432ay c0432ay2 = new C0432ay(obj3, iV, nt3, obj4, i16, jC03, jC04, c0480bu5.b, c0480bu5.c);
            this.m.c(11, new InterfaceC0889jr() { // from class: x.hj
                @Override // x.InterfaceC0889jr
                public final void b(Object obj8) {
                    Zx zx = (Zx) obj8;
                    zx.getClass();
                    zx.w(i2, c0432ay, c0432ay2);
                }
            });
        } else {
            i6 = i11;
            z3 = zEquals2;
            z4 = zBooleanValue;
        }
        if (z4) {
            this.m.c(1, new C0469bj(iIntValue, 1, nt));
        }
        final int i17 = 7;
        if (jx2.f != jx.f) {
            this.m.c(10, new InterfaceC0889jr() { // from class: x.cj
                @Override // x.InterfaceC0889jr
                public final void b(Object obj8) {
                    Zx zx = (Zx) obj8;
                    switch (i17) {
                        case 0:
                            Jx jx4 = jx;
                            boolean z5 = jx4.g;
                            zx.getClass();
                            zx.k(jx4.g);
                            break;
                        case 1:
                            Jx jx5 = jx;
                            zx.s(jx5.e, jx5.l);
                            break;
                        case 2:
                            zx.y(jx.e);
                            break;
                        case 3:
                            Jx jx6 = jx;
                            zx.t(jx6.m, jx6.l);
                            break;
                        case 4:
                            zx.c(jx.n);
                            break;
                        case 5:
                            zx.M(jx.m());
                            break;
                        case 6:
                            zx.i(jx.o);
                            break;
                        case 7:
                            zx.f(jx.f);
                            break;
                        case 8:
                            zx.L(jx.f);
                            break;
                        default:
                            zx.j((C0661fK) jx.i.l);
                            break;
                    }
                }
            });
            if (jx.f != null) {
                final int i18 = 8;
                this.m.c(10, new InterfaceC0889jr() { // from class: x.cj
                    @Override // x.InterfaceC0889jr
                    public final void b(Object obj8) {
                        Zx zx = (Zx) obj8;
                        switch (i18) {
                            case 0:
                                Jx jx4 = jx;
                                boolean z5 = jx4.g;
                                zx.getClass();
                                zx.k(jx4.g);
                                break;
                            case 1:
                                Jx jx5 = jx;
                                zx.s(jx5.e, jx5.l);
                                break;
                            case 2:
                                zx.y(jx.e);
                                break;
                            case 3:
                                Jx jx6 = jx;
                                zx.t(jx6.m, jx6.l);
                                break;
                            case 4:
                                zx.c(jx.n);
                                break;
                            case 5:
                                zx.M(jx.m());
                                break;
                            case 6:
                                zx.i(jx.o);
                                break;
                            case 7:
                                zx.f(jx.f);
                                break;
                            case 8:
                                zx.L(jx.f);
                                break;
                            default:
                                zx.j((C0661fK) jx.i.l);
                                break;
                        }
                    }
                });
            }
        }
        C0558dK c0558dK = jx2.i;
        C0558dK c0558dK2 = jx.i;
        if (c0558dK != c0558dK2) {
            AbstractC1472v2 abstractC1472v2 = this.i;
            Object obj8 = c0558dK2.m;
            abstractC1472v2.getClass();
            final int i19 = 9;
            this.m.c(2, new InterfaceC0889jr() { // from class: x.cj
                @Override // x.InterfaceC0889jr
                public final void b(Object obj82) {
                    Zx zx = (Zx) obj82;
                    switch (i19) {
                        case 0:
                            Jx jx4 = jx;
                            boolean z5 = jx4.g;
                            zx.getClass();
                            zx.k(jx4.g);
                            break;
                        case 1:
                            Jx jx5 = jx;
                            zx.s(jx5.e, jx5.l);
                            break;
                        case 2:
                            zx.y(jx.e);
                            break;
                        case 3:
                            Jx jx6 = jx;
                            zx.t(jx6.m, jx6.l);
                            break;
                        case 4:
                            zx.c(jx.n);
                            break;
                        case 5:
                            zx.M(jx.m());
                            break;
                        case 6:
                            zx.i(jx.o);
                            break;
                        case 7:
                            zx.f(jx.f);
                            break;
                        case 8:
                            zx.L(jx.f);
                            break;
                        default:
                            zx.j((C0661fK) jx.i.l);
                            break;
                    }
                }
            });
        }
        if (!z3) {
            this.m.c(14, new C0802i5(11, this.R));
        }
        if (i13 != 0) {
            final int i20 = 0;
            this.m.c(3, new InterfaceC0889jr() { // from class: x.cj
                @Override // x.InterfaceC0889jr
                public final void b(Object obj82) {
                    Zx zx = (Zx) obj82;
                    switch (i20) {
                        case 0:
                            Jx jx4 = jx;
                            boolean z5 = jx4.g;
                            zx.getClass();
                            zx.k(jx4.g);
                            break;
                        case 1:
                            Jx jx5 = jx;
                            zx.s(jx5.e, jx5.l);
                            break;
                        case 2:
                            zx.y(jx.e);
                            break;
                        case 3:
                            Jx jx6 = jx;
                            zx.t(jx6.m, jx6.l);
                            break;
                        case 4:
                            zx.c(jx.n);
                            break;
                        case 5:
                            zx.M(jx.m());
                            break;
                        case 6:
                            zx.i(jx.o);
                            break;
                        case 7:
                            zx.f(jx.f);
                            break;
                        case 8:
                            zx.L(jx.f);
                            break;
                        default:
                            zx.j((C0661fK) jx.i.l);
                            break;
                    }
                }
            });
        }
        if (i12 != 0 || i6 != 0) {
            final int i21 = 1;
            this.m.c(-1, new InterfaceC0889jr() { // from class: x.cj
                @Override // x.InterfaceC0889jr
                public final void b(Object obj82) {
                    Zx zx = (Zx) obj82;
                    switch (i21) {
                        case 0:
                            Jx jx4 = jx;
                            boolean z5 = jx4.g;
                            zx.getClass();
                            zx.k(jx4.g);
                            break;
                        case 1:
                            Jx jx5 = jx;
                            zx.s(jx5.e, jx5.l);
                            break;
                        case 2:
                            zx.y(jx.e);
                            break;
                        case 3:
                            Jx jx6 = jx;
                            zx.t(jx6.m, jx6.l);
                            break;
                        case 4:
                            zx.c(jx.n);
                            break;
                        case 5:
                            zx.M(jx.m());
                            break;
                        case 6:
                            zx.i(jx.o);
                            break;
                        case 7:
                            zx.f(jx.f);
                            break;
                        case 8:
                            zx.L(jx.f);
                            break;
                        default:
                            zx.j((C0661fK) jx.i.l);
                            break;
                    }
                }
            });
        }
        final int i22 = 4;
        if (i12 != 0) {
            final int i23 = 2;
            this.m.c(4, new InterfaceC0889jr() { // from class: x.cj
                @Override // x.InterfaceC0889jr
                public final void b(Object obj82) {
                    Zx zx = (Zx) obj82;
                    switch (i23) {
                        case 0:
                            Jx jx4 = jx;
                            boolean z5 = jx4.g;
                            zx.getClass();
                            zx.k(jx4.g);
                            break;
                        case 1:
                            Jx jx5 = jx;
                            zx.s(jx5.e, jx5.l);
                            break;
                        case 2:
                            zx.y(jx.e);
                            break;
                        case 3:
                            Jx jx6 = jx;
                            zx.t(jx6.m, jx6.l);
                            break;
                        case 4:
                            zx.c(jx.n);
                            break;
                        case 5:
                            zx.M(jx.m());
                            break;
                        case 6:
                            zx.i(jx.o);
                            break;
                        case 7:
                            zx.f(jx.f);
                            break;
                        case 8:
                            zx.L(jx.f);
                            break;
                        default:
                            zx.j((C0661fK) jx.i.l);
                            break;
                    }
                }
            });
        }
        final int i24 = 5;
        if (i6 != 0 || jx2.m != jx.m) {
            final int i25 = 3;
            this.m.c(5, new InterfaceC0889jr() { // from class: x.cj
                @Override // x.InterfaceC0889jr
                public final void b(Object obj82) {
                    Zx zx = (Zx) obj82;
                    switch (i25) {
                        case 0:
                            Jx jx4 = jx;
                            boolean z5 = jx4.g;
                            zx.getClass();
                            zx.k(jx4.g);
                            break;
                        case 1:
                            Jx jx5 = jx;
                            zx.s(jx5.e, jx5.l);
                            break;
                        case 2:
                            zx.y(jx.e);
                            break;
                        case 3:
                            Jx jx6 = jx;
                            zx.t(jx6.m, jx6.l);
                            break;
                        case 4:
                            zx.c(jx.n);
                            break;
                        case 5:
                            zx.M(jx.m());
                            break;
                        case 6:
                            zx.i(jx.o);
                            break;
                        case 7:
                            zx.f(jx.f);
                            break;
                        case 8:
                            zx.L(jx.f);
                            break;
                        default:
                            zx.j((C0661fK) jx.i.l);
                            break;
                    }
                }
            });
        }
        final int i26 = 6;
        if (jx2.n != jx.n) {
            this.m.c(6, new InterfaceC0889jr() { // from class: x.cj
                @Override // x.InterfaceC0889jr
                public final void b(Object obj82) {
                    Zx zx = (Zx) obj82;
                    switch (i22) {
                        case 0:
                            Jx jx4 = jx;
                            boolean z5 = jx4.g;
                            zx.getClass();
                            zx.k(jx4.g);
                            break;
                        case 1:
                            Jx jx5 = jx;
                            zx.s(jx5.e, jx5.l);
                            break;
                        case 2:
                            zx.y(jx.e);
                            break;
                        case 3:
                            Jx jx6 = jx;
                            zx.t(jx6.m, jx6.l);
                            break;
                        case 4:
                            zx.c(jx.n);
                            break;
                        case 5:
                            zx.M(jx.m());
                            break;
                        case 6:
                            zx.i(jx.o);
                            break;
                        case 7:
                            zx.f(jx.f);
                            break;
                        case 8:
                            zx.L(jx.f);
                            break;
                        default:
                            zx.j((C0661fK) jx.i.l);
                            break;
                    }
                }
            });
        }
        if (jx2.m() != jx.m()) {
            this.m.c(7, new InterfaceC0889jr() { // from class: x.cj
                @Override // x.InterfaceC0889jr
                public final void b(Object obj82) {
                    Zx zx = (Zx) obj82;
                    switch (i24) {
                        case 0:
                            Jx jx4 = jx;
                            boolean z5 = jx4.g;
                            zx.getClass();
                            zx.k(jx4.g);
                            break;
                        case 1:
                            Jx jx5 = jx;
                            zx.s(jx5.e, jx5.l);
                            break;
                        case 2:
                            zx.y(jx.e);
                            break;
                        case 3:
                            Jx jx6 = jx;
                            zx.t(jx6.m, jx6.l);
                            break;
                        case 4:
                            zx.c(jx.n);
                            break;
                        case 5:
                            zx.M(jx.m());
                            break;
                        case 6:
                            zx.i(jx.o);
                            break;
                        case 7:
                            zx.f(jx.f);
                            break;
                        case 8:
                            zx.L(jx.f);
                            break;
                        default:
                            zx.j((C0661fK) jx.i.l);
                            break;
                    }
                }
            });
        }
        if (!jx2.o.equals(jx.o)) {
            this.m.c(12, new InterfaceC0889jr() { // from class: x.cj
                @Override // x.InterfaceC0889jr
                public final void b(Object obj82) {
                    Zx zx = (Zx) obj82;
                    switch (i26) {
                        case 0:
                            Jx jx4 = jx;
                            boolean z5 = jx4.g;
                            zx.getClass();
                            zx.k(jx4.g);
                            break;
                        case 1:
                            Jx jx5 = jx;
                            zx.s(jx5.e, jx5.l);
                            break;
                        case 2:
                            zx.y(jx.e);
                            break;
                        case 3:
                            Jx jx6 = jx;
                            zx.t(jx6.m, jx6.l);
                            break;
                        case 4:
                            zx.c(jx.n);
                            break;
                        case 5:
                            zx.M(jx.m());
                            break;
                        case 6:
                            zx.i(jx.o);
                            break;
                        case 7:
                            zx.f(jx.f);
                            break;
                        case 8:
                            zx.L(jx.f);
                            break;
                        default:
                            zx.j((C0661fK) jx.i.l);
                            break;
                    }
                }
            });
        }
        Y();
        this.m.b();
        if (jx2.p != jx.p) {
            Iterator it = this.n.iterator();
            while (it.hasNext()) {
                ((SurfaceHolderCallbackC0881jj) it.next()).h.b0();
            }
        }
    }

    public final void b0() {
        int iE = E();
        C0991lp c0991lp = this.A;
        C1597xN c1597xN = this.z;
        boolean z = false;
        if (iE != 1) {
            if (iE == 2 || iE == 3) {
                c0();
                boolean z2 = this.n0.p;
                if (D() && !z2) {
                    z = true;
                }
                c1597xN.b(z);
                c0991lp.a(D());
                return;
            }
            if (iE != 4) {
                throw new IllegalStateException();
            }
        }
        c1597xN.b(false);
        c0991lp.a(false);
    }

    public final void c0() {
        this.d.b();
        Thread threadCurrentThread = Thread.currentThread();
        Looper looper = this.t;
        if (threadCurrentThread != looper.getThread()) {
            String name = Thread.currentThread().getName();
            String name2 = looper.getThread().getName();
            String str = AbstractC1595xL.a;
            Locale locale = Locale.US;
            String str2 = "Player is accessed on the wrong thread.\nCurrent thread: '" + name + "'\nExpected thread: '" + name2 + "'\nSee https://developer.android.com/guide/topics/media/issues/player-accessed-on-wrong-thread";
            if (this.e0) {
                throw new IllegalStateException(str2);
            }
            AbstractC1578x4.g0("ExoPlayerImpl", str2, this.f0 ? null : new IllegalStateException());
            this.f0 = true;
        }
    }

    @Override // androidx.media3.exoplayer.ExoPlayer
    public final boolean isScrubbingModeEnabled() {
        c0();
        return this.M;
    }

    @Override // x.Z5
    public final void j(int i, long j, boolean z) {
        c0();
        if (i == -1) {
            return;
        }
        QK.k(i >= 0);
        AbstractC1074nJ abstractC1074nJ = this.n0.a;
        if (abstractC1074nJ.p() || i < abstractC1074nJ.o()) {
            C0371Zd c0371Zd = this.s;
            if (!c0371Zd.p) {
                C1263r1 c1263r1N = c0371Zd.N();
                c0371Zd.p = true;
                c0371Zd.S(c1263r1N, -1, new C0906k7(29));
            }
            this.J++;
            if (I()) {
                AbstractC1578x4.f0("ExoPlayerImpl", "seekTo ignored because an ad is playing");
                C1348sj c1348sj = new C1348sj(this.n0);
                c1348sj.f(1);
                C1089nj c1089nj = this.k.h;
                c1089nj.j.e(new RunnableC0747h2(c1089nj, 15, c1348sj));
                return;
            }
            Jx jxH = this.n0;
            int i2 = jxH.e;
            if (i2 == 3 || (i2 == 4 && !abstractC1074nJ.p())) {
                jxH = this.n0.h(2);
            }
            int iV = v();
            Jx jxK = K(jxH, abstractC1074nJ, L(abstractC1074nJ, i, j));
            this.l.n.c(3, new C1452uj(abstractC1074nJ, i, AbstractC1595xL.P(j))).b();
            a0(jxK, 0, true, 1, y(jxK), iV, z);
        }
    }

    public final Rt o() {
        AbstractC1074nJ abstractC1074nJZ = z();
        if (abstractC1074nJZ.p()) {
            return this.m0;
        }
        Nt nt = abstractC1074nJZ.m(v(), (C1022mJ) this.a, 0L).c;
        Qt qtA = this.m0.a();
        Rt rt = nt.d;
        if (rt != null) {
            AbstractC0577dp abstractC0577dp = rt.B;
            byte[] bArr = rt.f;
            CharSequence charSequence = rt.a;
            if (charSequence != null) {
                qtA.a = charSequence;
            }
            CharSequence charSequence2 = rt.b;
            if (charSequence2 != null) {
                qtA.b = charSequence2;
            }
            CharSequence charSequence3 = rt.c;
            if (charSequence3 != null) {
                qtA.c = charSequence3;
            }
            CharSequence charSequence4 = rt.d;
            if (charSequence4 != null) {
                qtA.d = charSequence4;
            }
            CharSequence charSequence5 = rt.e;
            if (charSequence5 != null) {
                qtA.e = charSequence5;
            }
            if (bArr != null) {
                Integer num = rt.g;
                qtA.f = bArr == null ? null : (byte[]) bArr.clone();
                qtA.g = num;
                Rt rt2 = Rt.C;
            }
            Integer num2 = rt.h;
            if (num2 != null) {
                qtA.h = num2;
            }
            Integer num3 = rt.i;
            if (num3 != null) {
                qtA.i = num3;
            }
            Integer num4 = rt.j;
            if (num4 != null) {
                qtA.j = num4;
            }
            Boolean bool = rt.k;
            if (bool != null) {
                qtA.k = bool;
            }
            Integer num5 = rt.l;
            if (num5 != null) {
                qtA.l = num5;
            }
            Integer num6 = rt.m;
            if (num6 != null) {
                qtA.l = num6;
            }
            Integer num7 = rt.n;
            if (num7 != null) {
                qtA.m = num7;
            }
            Integer num8 = rt.o;
            if (num8 != null) {
                qtA.n = num8;
            }
            Integer num9 = rt.p;
            if (num9 != null) {
                qtA.o = num9;
            }
            Integer num10 = rt.q;
            if (num10 != null) {
                qtA.p = num10;
            }
            Integer num11 = rt.r;
            if (num11 != null) {
                qtA.q = num11;
            }
            CharSequence charSequence6 = rt.s;
            if (charSequence6 != null) {
                qtA.r = charSequence6;
            }
            CharSequence charSequence7 = rt.t;
            if (charSequence7 != null) {
                qtA.s = charSequence7;
            }
            CharSequence charSequence8 = rt.u;
            if (charSequence8 != null) {
                qtA.t = charSequence8;
            }
            CharSequence charSequence9 = rt.v;
            if (charSequence9 != null) {
                qtA.u = charSequence9;
            }
            Integer num12 = rt.w;
            if (num12 != null) {
                qtA.v = num12;
            }
            Integer num13 = rt.f49x;
            if (num13 != null) {
                qtA.w = num13;
            }
            CharSequence charSequence10 = rt.y;
            if (charSequence10 != null) {
                qtA.f48x = charSequence10;
            }
            CharSequence charSequence11 = rt.z;
            if (charSequence11 != null) {
                qtA.y = charSequence11;
            }
            Integer num14 = rt.A;
            if (num14 != null) {
                qtA.z = num14;
            }
            if (!abstractC0577dp.isEmpty()) {
                qtA.A = AbstractC0577dp.j(abstractC0577dp);
            }
        }
        return new Rt(qtA);
    }

    public final void p() {
        c0();
        Q();
        W(null);
        M(0, 0);
    }

    public final Sy q(Ry ry) {
        int iB = B(this.n0);
        AbstractC1074nJ abstractC1074nJ = this.n0.a;
        if (iB == -1) {
            iB = 0;
        }
        C1504vj c1504vj = this.l;
        return new Sy(c1504vj, ry, abstractC1074nJ, iB, c1504vj.p);
    }

    public final long r() {
        c0();
        if (this.n0.a.p()) {
            return this.p0;
        }
        Jx jx = this.n0;
        long j = 0;
        if (jx.k.d != jx.b.d) {
            return AbstractC1595xL.c0(jx.a.m(v(), (C1022mJ) this.a, 0L).m);
        }
        long j2 = jx.q;
        if (this.n0.k.c()) {
            Jx jx2 = this.n0;
            jx2.a.g(jx2.k.a, this.o).d(this.n0.k.b);
        } else {
            j = j2;
        }
        Jx jx3 = this.n0;
        AbstractC1074nJ abstractC1074nJ = jx3.a;
        Object obj = jx3.k.a;
        C0970lJ c0970lJ = this.o;
        abstractC1074nJ.g(obj, c0970lJ);
        return AbstractC1595xL.c0(j + c0970lJ.e);
    }

    public final long s(Jx jx) {
        C0480bu c0480bu = jx.b;
        long j = jx.c;
        AbstractC1074nJ abstractC1074nJ = jx.a;
        if (!c0480bu.c()) {
            return AbstractC1595xL.c0(y(jx));
        }
        Object obj = jx.b.a;
        C0970lJ c0970lJ = this.o;
        abstractC1074nJ.g(obj, c0970lJ);
        if (j == -9223372036854775807L) {
            return AbstractC1595xL.c0(abstractC1074nJ.m(B(jx), (C1022mJ) this.a, 0L).l);
        }
        return AbstractC1595xL.c0(j) + AbstractC1595xL.c0(c0970lJ.e);
    }

    @Override // androidx.media3.exoplayer.ExoPlayer
    public final void setImageOutput(ImageOutput imageOutput) {
        c0();
        R(4, 15, imageOutput);
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r0v13 */
    /* JADX WARN: Type inference failed for: r0v7 */
    /* JADX WARN: Type inference failed for: r0v8, types: [x.bK] */
    /* JADX WARN: Type inference failed for: r2v3, types: [x.Cf, x.aK] */
    @Override // androidx.media3.exoplayer.ExoPlayer
    public final void setScrubbingModeEnabled(boolean z) {
        C0050Df c0050DfA;
        c0();
        if (z == this.M) {
            return;
        }
        this.M = z;
        C1328sE c1328sE = this.O;
        if (!c1328sE.a.isEmpty()) {
            AbstractC1472v2 abstractC1472v2 = this.i;
            abstractC1472v2.getClass();
            C0125If c0125If = (C0125If) abstractC1472v2;
            C0050Df c0050Df = c0125If.e;
            if (z) {
                this.N = c0050Df.w;
                AbstractC0785hp abstractC0785hp = c1328sE.a;
                C0403aK c0403aKA = c0050Df.a();
                AbstractC0818iL it = abstractC0785hp.iterator();
                while (it.hasNext()) {
                    c0403aKA.i(((Integer) it.next()).intValue(), true);
                }
                c0050DfA = c0403aKA.a();
            } else {
                c0050Df.getClass();
                C0035Cf c0035Cf = new C0035Cf(c0050Df);
                c0035Cf.j(this.N);
                C0050Df c0050Df2 = new C0050Df(c0035Cf);
                this.N = null;
                c0050DfA = c0050Df2;
            }
            if (!c0050DfA.equals(c0050Df)) {
                if (c0050DfA instanceof C0050Df) {
                    c0125If.u(c0050DfA);
                }
                ?? c0035Cf2 = new C0035Cf(c0125If.e);
                c0035Cf2.c(c0050DfA);
                c0125If.u(new C0050Df(c0035Cf2));
            }
        }
        this.l.n.c(36, Boolean.valueOf(z)).b();
        Jx jx = this.n0;
        Z(jx.m, jx.l);
    }

    public final int t() {
        c0();
        if (I()) {
            return this.n0.b.b;
        }
        return -1;
    }

    public final int u() {
        c0();
        if (I()) {
            return this.n0.b.c;
        }
        return -1;
    }

    public final int v() {
        c0();
        int iB = B(this.n0);
        if (iB == -1) {
            return 0;
        }
        return iB;
    }

    public final int w() {
        c0();
        if (!this.n0.a.p()) {
            Jx jx = this.n0;
            return jx.a.b(jx.b.a);
        }
        int i = this.o0;
        if (i == -1) {
            return 0;
        }
        return i;
    }

    public final long x() {
        c0();
        return AbstractC1595xL.c0(y(this.n0));
    }

    public final long y(Jx jx) {
        if (jx.a.p()) {
            return AbstractC1595xL.P(this.p0);
        }
        long jL = jx.p ? jx.l() : jx.s;
        if (jx.b.c()) {
            return jL;
        }
        AbstractC1074nJ abstractC1074nJ = jx.a;
        Object obj = jx.b.a;
        C0970lJ c0970lJ = this.o;
        abstractC1074nJ.g(obj, c0970lJ);
        return jL + c0970lJ.e;
    }

    public final AbstractC1074nJ z() {
        c0();
        return this.n0.a;
    }
}
