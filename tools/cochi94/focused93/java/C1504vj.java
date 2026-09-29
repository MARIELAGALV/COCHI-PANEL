package x;

import android.content.Context;
import android.media.MediaFormat;
import android.media.Spatializer;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.os.SystemClock;
import android.text.TextUtils;
import android.util.Pair;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

/* renamed from: x.vj, reason: case insensitive filesystem */
/* loaded from: classes.dex */
public final class C1504vj implements Handler.Callback, Vt, Qy, ZL {
    public static final long n0 = AbstractC1595xL.c0(10000);
    public final long A;
    public final Py B;
    public final boolean C;
    public final C0371Zd D;
    public final C1696zI E;
    public final boolean F;
    public final C1370t4 G;
    public boolean H;
    public C1640yE I;
    public C1328sE J;
    public boolean K;
    public boolean L;
    public C1452uj M;
    public int N;
    public Jx O;
    public C1348sj P;
    public boolean Q;
    public boolean R;
    public boolean S;
    public boolean T;
    public long U;
    public boolean V;
    public int W;
    public boolean X;
    public boolean Y;
    public boolean Z;
    public boolean a0;
    public int b0;
    public C1452uj c0;
    public long d0;
    public long e0;
    public int f0;
    public boolean g0;
    public final HB[] h;
    public C0348Xi h0;
    public final AbstractC0389a6[] i;
    public long i0;
    public final boolean[] j;
    public C0417aj j0;
    public final AbstractC1472v2 k;
    public long k0;
    public final C0558dK l;
    public boolean l0;
    public final InterfaceC1356sr m;
    public float m0;
    public final C1696zI n;
    public final Kx o;
    public final Looper p;
    public final C1022mJ q;
    public final C0970lJ r;
    public final long s;
    public final C0465bf t;
    public final ArrayList u;
    public final C1592xI v;
    public final C0675fj w;

    /* renamed from: x, reason: collision with root package name */
    public final Zt f97x;
    public final C1359su y;
    public final C0358Ye z;

    public C1504vj(Context context, AbstractC0389a6[] abstractC0389a6Arr, AbstractC0389a6[] abstractC0389a6Arr2, AbstractC1472v2 abstractC1472v2, C0558dK c0558dK, InterfaceC1356sr interfaceC1356sr, I5 i5, int i, boolean z, C0371Zd c0371Zd, C1640yE c1640yE, C0358Ye c0358Ye, long j, boolean z2, Looper looper, C1592xI c1592xI, C0675fj c0675fj, Py py, final ZL zl, boolean z3) {
        C0417aj c0417aj = C0417aj.a;
        this.k0 = -9223372036854775807L;
        this.w = c0675fj;
        this.k = abstractC1472v2;
        this.l = c0558dK;
        this.m = interfaceC1356sr;
        this.W = i;
        this.X = z;
        this.I = c1640yE;
        this.z = c0358Ye;
        this.A = j;
        this.R = false;
        this.C = z2;
        this.v = c1592xI;
        this.B = py;
        this.j0 = c0417aj;
        this.D = c0371Zd;
        this.m0 = 1.0f;
        this.J = C1328sE.b;
        this.H = z3;
        this.i0 = -9223372036854775807L;
        this.U = -9223372036854775807L;
        this.s = ((C0413af) interfaceC1356sr).o;
        C0918kJ c0918kJ = AbstractC1074nJ.a;
        Jx jxK = Jx.k(c0558dK);
        this.O = jxK;
        this.P = new C1348sj(jxK);
        this.i = new AbstractC0389a6[abstractC0389a6Arr.length];
        this.j = new boolean[abstractC0389a6Arr.length];
        C0125If c0125If = (C0125If) abstractC1472v2;
        c0125If.getClass();
        this.h = new HB[abstractC0389a6Arr.length];
        boolean z4 = false;
        for (int i2 = 0; i2 < abstractC0389a6Arr.length; i2++) {
            AbstractC0389a6 abstractC0389a6 = abstractC0389a6Arr[i2];
            abstractC0389a6.l = i2;
            abstractC0389a6.m = py;
            abstractC0389a6.n = c1592xI;
            this.i[i2] = abstractC0389a6;
            AbstractC0389a6 abstractC0389a62 = this.i[i2];
            synchronized (abstractC0389a62.h) {
                abstractC0389a62.z = c0125If;
            }
            AbstractC0389a6 abstractC0389a63 = abstractC0389a6Arr2[i2];
            if (abstractC0389a63 != null) {
                abstractC0389a63.l = i2;
                abstractC0389a63.m = py;
                abstractC0389a63.n = c1592xI;
                z4 = true;
            }
            HB[] hbArr = this.h;
            AbstractC0389a6 abstractC0389a64 = abstractC0389a6Arr[i2];
            HB hb = new HB();
            hb.e = abstractC0389a64;
            hb.c = i2;
            hb.f = abstractC0389a63;
            hb.d = 0;
            hb.a = false;
            hb.b = false;
            hbArr[i2] = hb;
        }
        this.F = z4;
        this.t = new C0465bf(this, c1592xI);
        this.u = new ArrayList();
        this.q = new C1022mJ();
        this.r = new C0970lJ();
        QK.z(((C1504vj) c0125If.a) == null);
        c0125If.a = this;
        c0125If.b = i5;
        c0125If.f = c0125If.e;
        this.g0 = true;
        C1696zI c1696zIA = c1592xI.a(looper, null);
        this.E = c1696zIA;
        this.f97x = new Zt(c0371Zd, c1696zIA, new C0802i5(17, this), abstractC0389a6Arr.length);
        this.y = new C1359su(this, c0371Zd, c1696zIA, py, i5);
        Kx kx = new Kx();
        this.o = kx;
        Looper looperB = kx.b();
        this.p = looperB;
        C1696zI c1696zIA2 = c1592xI.a(looperB, this);
        this.n = c1696zIA2;
        this.G = new C1370t4(context, looperB, this);
        c1696zIA2.c(35, new ZL() { // from class: x.oj
            @Override // x.ZL
            public final void b(long j2, long j3, C0145Jk c0145Jk, MediaFormat mediaFormat) {
                C1504vj c1504vj = this.h;
                c1504vj.getClass();
                zl.b(j2, j3, c0145Jk, mediaFormat);
                c1504vj.b(j2, j3, c0145Jk, mediaFormat);
            }
        }).b();
        c1696zIA2.c(39, new C1193pj(this)).b();
    }

    public static Pair T(AbstractC1074nJ abstractC1074nJ, C1452uj c1452uj, boolean z, int i, boolean z2, C1022mJ c1022mJ, C0970lJ c0970lJ) {
        int iU;
        AbstractC1074nJ abstractC1074nJ2 = c1452uj.a;
        if (abstractC1074nJ.p()) {
            return null;
        }
        AbstractC1074nJ abstractC1074nJ3 = abstractC1074nJ2.p() ? abstractC1074nJ : abstractC1074nJ2;
        try {
            Pair pairI = abstractC1074nJ3.i(c1022mJ, c0970lJ, c1452uj.b, c1452uj.c);
            if (!abstractC1074nJ.equals(abstractC1074nJ3)) {
                if (abstractC1074nJ.b(pairI.first) == -1) {
                    if (!z || (iU = U(c1022mJ, c0970lJ, i, z2, pairI.first, abstractC1074nJ3, abstractC1074nJ)) == -1) {
                        return null;
                    }
                    return abstractC1074nJ.i(c1022mJ, c0970lJ, iU, -9223372036854775807L);
                }
                if (abstractC1074nJ3.g(pairI.first, c0970lJ).f && abstractC1074nJ3.m(c0970lJ.c, c1022mJ, 0L).n == abstractC1074nJ3.b(pairI.first)) {
                    return abstractC1074nJ.i(c1022mJ, c0970lJ, abstractC1074nJ.g(pairI.first, c0970lJ).c, c1452uj.c);
                }
            }
            return pairI;
        } catch (IndexOutOfBoundsException unused) {
            return null;
        }
    }

    public static int U(C1022mJ c1022mJ, C0970lJ c0970lJ, int i, boolean z, Object obj, AbstractC1074nJ abstractC1074nJ, AbstractC1074nJ abstractC1074nJ2) {
        C1022mJ c1022mJ2 = c1022mJ;
        AbstractC1074nJ abstractC1074nJ3 = abstractC1074nJ;
        Object obj2 = abstractC1074nJ3.m(abstractC1074nJ3.g(obj, c0970lJ).c, c1022mJ, 0L).a;
        for (int i2 = 0; i2 < abstractC1074nJ2.o(); i2++) {
            if (abstractC1074nJ2.m(i2, c1022mJ, 0L).a.equals(obj2)) {
                return i2;
            }
        }
        int iB = abstractC1074nJ3.b(obj);
        int iH = abstractC1074nJ3.h();
        int iB2 = -1;
        int i3 = 0;
        while (i3 < iH && iB2 == -1) {
            AbstractC1074nJ abstractC1074nJ4 = abstractC1074nJ3;
            int iD = abstractC1074nJ4.d(iB, c0970lJ, c1022mJ2, i, z);
            if (iD == -1) {
                break;
            }
            iB2 = abstractC1074nJ2.b(abstractC1074nJ4.l(iD));
            i3++;
            abstractC1074nJ3 = abstractC1074nJ4;
            iB = iD;
            c1022mJ2 = c1022mJ;
        }
        if (iB2 == -1) {
            return -1;
        }
        return abstractC1074nJ2.f(iB2, c0970lJ, false).c;
    }

    public static boolean z(Xt xt) {
        if (xt != null) {
            try {
                C1409ts c1409ts = xt.a;
                if (xt.e) {
                    for (WD wd : xt.c) {
                        if (wd != null) {
                            wd.a();
                        }
                    }
                } else {
                    c1409ts.r();
                }
                if ((!xt.e ? 0L : c1409ts.k()) != Long.MIN_VALUE) {
                    return true;
                }
            } catch (IOException unused) {
            }
        }
        return false;
    }

    public final boolean A() {
        for (int i = 0; i < this.h.length; i++) {
            Zt zt = this.f97x;
            if (!Objects.equals(zt.i, zt.j[i])) {
                return true;
            }
        }
        return false;
    }

    public final void A0() {
        Xt xt = this.f97x.l;
        boolean z = this.V || (xt != null && xt.a.c());
        Jx jx = this.O;
        if (z != jx.g) {
            this.O = jx.b(z);
        }
    }

    public final boolean B(int i, C0480bu c0480bu) {
        Zt zt = this.f97x;
        Xt xt = zt.k[i];
        if (xt == null || !xt.g.a.equals(c0480bu)) {
            return false;
        }
        return this.h[i].h(zt.k[i]);
    }

    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    /* JADX WARN: Removed duplicated region for block: B:15:0x007d  */
    /* JADX WARN: Removed duplicated region for block: B:24:0x009b  */
    /* JADX WARN: Removed duplicated region for block: B:42:0x00c5 A[SYNTHETIC] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void B0(C0480bu c0480bu, C0558dK c0558dK) {
        boolean z;
        int length;
        int i;
        Xt xt = this.f97x.l;
        xt.getClass();
        p(xt.d());
        if (w0(this.O.a, xt.g.a)) {
            long j = this.z.h;
        }
        AbstractC1074nJ abstractC1074nJ = this.O.a;
        float f = this.t.b().a;
        boolean z2 = this.O.l;
        InterfaceC1608xj[] interfaceC1608xjArr = (InterfaceC1608xj[]) c0558dK.k;
        C0413af c0413af = (C0413af) this.m;
        c0413af.getClass();
        AB ab = c0413af.p;
        Py py = this.B;
        Integer num = (Integer) ab.get(py.a);
        int iIntValue = (num == null || num.intValue() == -1) ? c0413af.l : num.intValue();
        C0372Ze c0372Ze = (C0372Ze) c0413af.q.get(py);
        c0372Ze.getClass();
        if (iIntValue == -1) {
            Kt kt = abstractC1074nJ.m(abstractC1074nJ.g(c0480bu.a, c0413af.b).c, c0413af.a, 0L).c.b;
            if (kt == null) {
                z = false;
                length = interfaceC1608xjArr.length;
                i = 0;
                int i2 = 0;
                while (true) {
                    int i3 = 13107200;
                    if (i >= length) {
                        InterfaceC1608xj interfaceC1608xj = interfaceC1608xjArr[i];
                        if (interfaceC1608xj != null) {
                            switch (interfaceC1608xj.k().c) {
                                case -2:
                                    i3 = 0;
                                    i2 += i3;
                                    break;
                                case -1:
                                case 1:
                                    i2 += i3;
                                    break;
                                case 0:
                                    i3 = 144310272;
                                    i2 += i3;
                                    break;
                                case 2:
                                    i3 = z ? 19660800 : 131072000;
                                    i2 += i3;
                                    break;
                                case 3:
                                case 5:
                                case 6:
                                    i3 = 131072;
                                    i2 += i3;
                                    break;
                                case 4:
                                    i3 = 26214400;
                                    i2 += i3;
                                    break;
                                default:
                                    throw new IllegalArgumentException();
                            }
                        }
                        i++;
                    } else {
                        iIntValue = AbstractC1595xL.i(i2, 13107200, 210239488);
                    }
                }
            } else {
                String scheme = kt.a.getScheme();
                if (TextUtils.isEmpty(scheme) || C0413af.s.contains(scheme)) {
                    z = true;
                }
                length = interfaceC1608xjArr.length;
                i = 0;
                int i22 = 0;
                while (true) {
                    int i32 = 13107200;
                    if (i >= length) {
                    }
                    i++;
                }
            }
        }
        c0372Ze.c = iIntValue;
        c0413af.d();
    }

    public final boolean C() {
        Xt xt = this.f97x.i;
        long j = xt.g.e;
        if (xt.e) {
            return j == -9223372036854775807L || this.O.s < j || !v0();
        }
        return false;
    }

    public final void C0(int i, int i2, List list) throws Throwable {
        this.P.f(1);
        C1359su c1359su = this.y;
        c1359su.getClass();
        ArrayList arrayList = (ArrayList) c1359su.d;
        QK.k(i >= 0 && i <= i2 && i2 <= arrayList.size());
        QK.k(list.size() == i2 - i);
        for (int i3 = i; i3 < i2; i3++) {
            ((C1307ru) arrayList.get(i3)).a.s((Nt) list.get(i3 - i));
        }
        v(c1359su.c(), false);
    }

    public final void D() {
        boolean zC;
        if (z(this.f97x.l)) {
            Xt xt = this.f97x.l;
            long jP = p(!xt.e ? 0L : xt.a.k());
            Xt xt2 = this.f97x.i;
            long j = w0(this.O.a, xt.g.a) ? this.z.h : -9223372036854775807L;
            Py py = this.B;
            AbstractC1074nJ abstractC1074nJ = this.O.a;
            C0480bu c0480bu = xt.g.a;
            float f = this.t.b().a;
            boolean z = this.O.l;
            C1304rr c1304rr = new C1304rr(py, abstractC1074nJ, c0480bu, jP, f, this.T, j);
            zC = ((C0413af) this.m).c(c1304rr);
            Xt xt3 = this.f97x.i;
            if (!zC && xt3.e && jP < 500000 && this.s > 0) {
                xt3.a.t(this.O.s);
                zC = ((C0413af) this.m).c(c1304rr);
            }
        } else {
            zC = false;
        }
        this.V = zC;
        if (zC) {
            Xt xt4 = this.f97x.l;
            xt4.getClass();
            Dr dr = new Dr();
            dr.a = this.d0 - xt4.p;
            float f2 = this.t.b().a;
            QK.k(f2 > 0.0f || f2 == -3.4028235E38f);
            dr.b = f2;
            long j2 = this.U;
            QK.k(j2 >= 0 || j2 == -9223372036854775807L);
            dr.c = j2;
            Er er = new Er(dr);
            QK.z(xt4.m == null);
            xt4.a.f(er);
        }
        A0();
    }

    public final void D0(int i, int i2, int i3, boolean z) {
        boolean z2 = z && i != -1;
        if (i == -1) {
            i3 = 2;
        } else if (i3 == 2) {
            i3 = 1;
        }
        boolean z3 = this.K;
        if (i == 0) {
            i2 = 1;
        } else if (i2 == 1) {
            i2 = z3 ? 4 : 0;
        }
        Jx jx = this.O;
        if (jx.l == z2 && jx.n == i2 && jx.m == i3) {
            return;
        }
        this.O = jx.e(i3, i2, z2);
        G0(false, false);
        Zt zt = this.f97x;
        for (Xt xt = zt.i; xt != null; xt = xt.m) {
            for (InterfaceC1608xj interfaceC1608xj : (InterfaceC1608xj[]) xt.o.k) {
                if (interfaceC1608xj != null) {
                    interfaceC1608xj.a(z2);
                }
            }
        }
        if (!v0()) {
            z0();
            E0();
            Jx jx2 = this.O;
            if (jx2.p) {
                this.O = jx2.i(false);
            }
            zt.s(this.d0);
            return;
        }
        int i4 = this.O.e;
        C1696zI c1696zI = this.n;
        if (i4 != 3) {
            if (i4 == 2) {
                c1696zI.h(2);
            }
        } else {
            C0465bf c0465bf = this.t;
            c0465bf.m = true;
            c0465bf.h.f();
            x0();
            c1696zI.h(2);
        }
    }

    public final void E() {
        Zt zt = this.f97x;
        zt.q();
        Xt xt = zt.m;
        if (xt != null) {
            C1409ts c1409ts = xt.a;
            if ((!xt.d || xt.e) && !c1409ts.c()) {
                AbstractC1074nJ abstractC1074nJ = this.O.a;
                if (xt.e) {
                    c1409ts.o();
                }
                Iterator it = ((C0413af) this.m).q.values().iterator();
                while (it.hasNext()) {
                    if (((C0372Ze) it.next()).b) {
                        return;
                    }
                }
                if (!xt.d) {
                    long j = xt.g.b;
                    xt.d = true;
                    c1409ts.w(this, j);
                    return;
                }
                Dr dr = new Dr();
                dr.a = this.d0 - xt.p;
                float f = this.t.b().a;
                QK.k(f > 0.0f || f == -3.4028235E38f);
                dr.b = f;
                long j2 = this.U;
                QK.k(j2 >= 0 || j2 == -9223372036854775807L);
                dr.c = j2;
                Er er = new Er(dr);
                QK.z(xt.m == null);
                c1409ts.f(er);
            }
        }
    }

    /* JADX WARN: Removed duplicated region for block: B:42:0x00be  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void E0() {
        Ox oxB;
        long j;
        float f;
        Xt xt = this.f97x.i;
        if (xt == null) {
            return;
        }
        long jL = xt.e ? xt.a.l() : -9223372036854775807L;
        if (jL != -9223372036854775807L) {
            if (!xt.g()) {
                this.f97x.t(xt);
                f();
                u(false);
                D();
            }
            R(jL, true);
            if (jL != this.O.s) {
                Jx jx = this.O;
                this.O = y(jx.b, jL, jx.c, jL, true, 5);
            }
        } else {
            C0465bf c0465bf = this.t;
            boolean zA = A();
            WG wg = c0465bf.h;
            AbstractC0389a6 abstractC0389a6 = c0465bf.j;
            if (abstractC0389a6 == null || abstractC0389a6.l() || ((zA && c0465bf.j.o != 2) || (!c0465bf.j.m() && (zA || c0465bf.j.k())))) {
                c0465bf.l = true;
                if (c0465bf.m) {
                    wg.f();
                }
            } else {
                InterfaceC0737gt interfaceC0737gt = c0465bf.k;
                interfaceC0737gt.getClass();
                long jE = interfaceC0737gt.e();
                if (!c0465bf.l) {
                    wg.c(jE);
                    oxB = interfaceC0737gt.b();
                    if (!oxB.equals(wg.l)) {
                        wg.d(oxB);
                        c0465bf.i.n.c(16, oxB).b();
                    }
                } else if (jE >= wg.e()) {
                    c0465bf.l = false;
                    if (c0465bf.m) {
                        wg.f();
                    }
                    wg.c(jE);
                    oxB = interfaceC0737gt.b();
                    if (!oxB.equals(wg.l)) {
                    }
                } else if (wg.i) {
                    wg.c(wg.e());
                    wg.i = false;
                }
            }
            long jE2 = c0465bf.e();
            this.d0 = jE2;
            long j2 = jE2 - xt.p;
            long j3 = this.O.s;
            if (!this.u.isEmpty() && !this.O.b.c()) {
                if (this.g0) {
                    this.g0 = false;
                }
                Jx jx2 = this.O;
                jx2.a.b(jx2.b.a);
                int iMin = Math.min(this.f0, this.u.size());
                if (iMin > 0 && this.u.get(iMin - 1) != null) {
                    throw new ClassCastException();
                }
                if (iMin < this.u.size() && this.u.get(iMin) != null) {
                    throw new ClassCastException();
                }
                this.f0 = iMin;
            }
            if (this.t.a()) {
                boolean z = !this.P.e;
                Jx jx3 = this.O;
                this.O = y(jx3.b, j2, jx3.c, j2, z, 6);
            } else {
                Jx jx4 = this.O;
                jx4.s = j2;
                jx4.t = SystemClock.elapsedRealtime();
            }
        }
        this.O.q = this.f97x.l.d();
        Jx jx5 = this.O;
        jx5.r = p(jx5.q);
        Jx jx6 = this.O;
        if (jx6.l && jx6.e == 3 && w0(jx6.a, jx6.b)) {
            Jx jx7 = this.O;
            float f2 = 1.0f;
            if (jx7.o.a == 1.0f) {
                C0358Ye c0358Ye = this.z;
                long jM = m(jx7.a, jx7.b.a, jx7.s);
                long j4 = this.O.r;
                if (c0358Ye.c != -9223372036854775807L) {
                    long j5 = jM - j4;
                    long j6 = c0358Ye.m;
                    if (j6 == -9223372036854775807L) {
                        c0358Ye.m = j5;
                        c0358Ye.n = 0L;
                    } else {
                        c0358Ye.m = Math.max(j5, (long) ((j5 * 9.999871E-4f) + (j6 * 0.999f)));
                        c0358Ye.n = (long) ((9.999871E-4f * Math.abs(j5 - r9)) + (c0358Ye.n * 0.999f));
                    }
                    if (c0358Ye.l != -9223372036854775807L) {
                        j = 1000;
                        if (SystemClock.elapsedRealtime() - c0358Ye.l < 1000) {
                            f2 = c0358Ye.k;
                        }
                    } else {
                        j = 1000;
                    }
                    c0358Ye.l = SystemClock.elapsedRealtime();
                    long j7 = (c0358Ye.n * 3) + c0358Ye.m;
                    if (c0358Ye.h > j7) {
                        float fP = AbstractC1595xL.P(j);
                        f = 1.0E-7f;
                        long[] jArr = {j7, c0358Ye.e, c0358Ye.h - (((long) ((c0358Ye.k - 1.0f) * fP)) + ((long) ((c0358Ye.i - 1.0f) * fP)))};
                        long j8 = jArr[0];
                        for (int i = 1; i < 3; i++) {
                            long j9 = jArr[i];
                            if (j9 > j8) {
                                j8 = j9;
                            }
                        }
                        c0358Ye.h = j8;
                    } else {
                        f = 1.0E-7f;
                        long j10 = AbstractC1595xL.j(jM - ((long) (Math.max(0.0f, c0358Ye.k - 1.0f) / 1.0E-7f)), c0358Ye.h, j7);
                        c0358Ye.h = j10;
                        long j11 = c0358Ye.g;
                        if (j11 != -9223372036854775807L && j10 > j11) {
                            c0358Ye.h = j11;
                        }
                    }
                    long j12 = jM - c0358Ye.h;
                    if (Math.abs(j12) < c0358Ye.a) {
                        c0358Ye.k = 1.0f;
                    } else {
                        c0358Ye.k = AbstractC1595xL.h((f * j12) + 1.0f, c0358Ye.j, c0358Ye.i);
                    }
                    f2 = c0358Ye.k;
                }
                if (this.t.b().a != f2) {
                    Ox ox = new Ox(f2, this.O.o.b);
                    this.n.g(16);
                    this.t.d(ox);
                    x(this.O.o, this.t.b().a, false, false);
                }
            }
        }
    }

    public final void F(int i) {
        C1348sj c1348sj = this.P;
        Jx jx = this.O;
        boolean z = c1348sj.d | (((Jx) c1348sj.f) != jx);
        c1348sj.d = z;
        c1348sj.f = jx;
        if (z) {
            if (!jx.a.p()) {
                Jx jx2 = this.O;
                boolean z2 = jx2.a.b(jx2.b.a) != -1;
                Locale locale = Locale.US;
                Jx jx3 = this.O;
                QK.y(String.format(locale, "periodUid %s not found in timeline %s with size %d triggered by msg %d", jx3.b.a, jx3.a.getClass().getName(), Integer.valueOf(this.O.a.o()), Integer.valueOf(i)), z2);
            }
            C1348sj c1348sj2 = this.P;
            C1089nj c1089nj = this.w.h;
            c1089nj.j.e(new RunnableC0747h2(c1089nj, 15, c1348sj2));
            this.P = new C1348sj(this.O);
        }
    }

    public final void F0(AbstractC1074nJ abstractC1074nJ, C0480bu c0480bu, AbstractC1074nJ abstractC1074nJ2, C0480bu c0480bu2, long j, boolean z) {
        boolean zW0 = w0(abstractC1074nJ, c0480bu);
        Object obj = c0480bu.a;
        if (!zW0) {
            Ox ox = c0480bu.c() ? Ox.d : this.O.o;
            C0465bf c0465bf = this.t;
            if (c0465bf.b().equals(ox)) {
                return;
            }
            this.n.g(16);
            c0465bf.d(ox);
            x(this.O.o, ox.a, false, false);
            return;
        }
        C0970lJ c0970lJ = this.r;
        int i = abstractC1074nJ.g(obj, c0970lJ).c;
        C1022mJ c1022mJ = this.q;
        abstractC1074nJ.n(i, c1022mJ);
        Jt jt = c1022mJ.j;
        C0358Ye c0358Ye = this.z;
        c0358Ye.getClass();
        c0358Ye.c = AbstractC1595xL.P(jt.a);
        c0358Ye.f = AbstractC1595xL.P(jt.b);
        c0358Ye.g = AbstractC1595xL.P(jt.c);
        float f = jt.d;
        if (f == -3.4028235E38f) {
            f = 0.97f;
        }
        c0358Ye.j = f;
        float f2 = jt.e;
        if (f2 == -3.4028235E38f) {
            f2 = 1.03f;
        }
        c0358Ye.i = f2;
        if (f == 1.0f && f2 == 1.0f) {
            c0358Ye.c = -9223372036854775807L;
        }
        c0358Ye.a();
        if (j != -9223372036854775807L) {
            c0358Ye.d = m(abstractC1074nJ, obj, j);
            c0358Ye.a();
            return;
        }
        if (!Objects.equals(!abstractC1074nJ2.p() ? abstractC1074nJ2.m(abstractC1074nJ2.g(c0480bu2.a, c0970lJ).c, c1022mJ, 0L).a : null, c1022mJ.a) || z) {
            c0358Ye.d = -9223372036854775807L;
            c0358Ye.a();
        }
    }

    public final void G(int i) {
        HB hb = this.h[i];
        try {
            Xt xt = this.f97x.i;
            xt.getClass();
            AbstractC0389a6 abstractC0389a6D = hb.d(xt);
            abstractC0389a6D.getClass();
            WD wd = abstractC0389a6D.p;
            wd.getClass();
            wd.a();
        } catch (IOException | RuntimeException e) {
            int i2 = ((AbstractC0389a6) hb.e).i;
            if (i2 != 3 && i2 != 5) {
                throw e;
            }
            C0558dK c0558dK = this.f97x.i.o;
            AbstractC1578x4.u("ExoPlayerImplInternal", "Disabling track due to error: " + C0145Jk.c(((InterfaceC1608xj[]) c0558dK.k)[i].l()), e);
            C0558dK c0558dK2 = new C0558dK((GB[]) ((GB[]) c0558dK.j).clone(), (InterfaceC1608xj[]) ((InterfaceC1608xj[]) c0558dK.k).clone(), (C0661fK) c0558dK.l, c0558dK.m);
            ((GB[]) c0558dK2.j)[i] = null;
            ((InterfaceC1608xj[]) c0558dK2.k)[i] = null;
            h(i);
            Xt xt2 = this.f97x.i;
            xt2.a(c0558dK2, this.O.s, false, new boolean[xt2.j.length]);
        }
    }

    public final void G0(boolean z, boolean z2) {
        long jElapsedRealtime;
        this.T = z;
        if (!z || z2) {
            jElapsedRealtime = -9223372036854775807L;
        } else {
            this.v.getClass();
            jElapsedRealtime = SystemClock.elapsedRealtime();
        }
        this.U = jElapsedRealtime;
    }

    public final void H(int i, boolean z) {
        boolean[] zArr = this.j;
        if (zArr[i] != z) {
            zArr[i] = z;
            this.E.e(new RunnableC1422u4(this, i, z));
        }
    }

    public final void I() throws Throwable {
        v(this.y.c(), true);
    }

    public final void J() {
        this.P.f(1);
        throw null;
    }

    public final void K() {
        this.P.f(1);
        P(false, false, false, true);
        C0413af c0413af = (C0413af) this.m;
        ConcurrentHashMap concurrentHashMap = c0413af.q;
        long id = Thread.currentThread().getId();
        long j = c0413af.r;
        QK.y("Players that share the same LoadControl must share the same playback thread. See ExoPlayer.Builder.setPlaybackLooper(Looper).", j == -1 || j == id);
        c0413af.r = id;
        Py py = this.B;
        C0372Ze c0372Ze = (C0372Ze) concurrentHashMap.get(py);
        if (c0372Ze == null) {
            C0372Ze c0372Ze2 = new C0372Ze();
            c0372Ze2.a = 1;
            concurrentHashMap.put(py, c0372Ze2);
        } else {
            c0372Ze.a++;
        }
        C0372Ze c0372Ze3 = (C0372Ze) concurrentHashMap.get(py);
        c0372Ze3.getClass();
        Integer num = (Integer) c0413af.p.get(py.a);
        int iIntValue = (num == null || num.intValue() == -1) ? c0413af.l : num.intValue();
        if (iIntValue == -1) {
            iIntValue = 13107200;
        }
        c0372Ze3.c = iIntValue;
        c0372Ze3.b = false;
        r0(this.O.a.p() ? 4 : 2);
        Jx jx = this.O;
        boolean z = jx.l;
        D0(this.G.d(jx.e, z), jx.n, jx.m, z);
        C1359su c1359su = this.y;
        ArrayList arrayList = (ArrayList) c1359su.d;
        QK.z(!c1359su.a);
        for (int i = 0; i < arrayList.size(); i++) {
            C1307ru c1307ru = (C1307ru) arrayList.get(i);
            c1359su.g(c1307ru);
            ((HashSet) c1359su.i).add(c1307ru);
        }
        c1359su.a = true;
        this.n.h(2);
    }

    public final void L(C1081nb c1081nb) {
        C0851j4 c0851j4;
        BG bg;
        try {
            P(true, false, true, false);
            M();
            InterfaceC1356sr interfaceC1356sr = this.m;
            Py py = this.B;
            C0413af c0413af = (C0413af) interfaceC1356sr;
            ConcurrentHashMap concurrentHashMap = c0413af.q;
            C0372Ze c0372Ze = (C0372Ze) concurrentHashMap.get(py);
            if (c0372Ze != null) {
                int i = c0372Ze.a - 1;
                c0372Ze.a = i;
                if (i == 0) {
                    concurrentHashMap.remove(py);
                    c0413af.d();
                }
            }
            if (c0413af.q.isEmpty()) {
                c0413af.r = -1L;
            }
            C1370t4 c1370t4 = this.G;
            c1370t4.c = null;
            c1370t4.a();
            c1370t4.c(0);
            C0125If c0125If = (C0125If) this.k;
            if (c0125If.g != null) {
                QK.y("DefaultTrackSelector is accessed on the wrong thread.", Thread.currentThread().equals(c0125If.g));
            }
            if (Build.VERSION.SDK_INT >= 32 && (c0851j4 = c0125If.h) != null) {
                Handler handler = (Handler) c0851j4.j;
                Spatializer spatializer = (Spatializer) c0851j4.i;
                if (spatializer != null && (bg = (BG) c0851j4.k) != null && handler != null) {
                    spatializer.removeOnSpatializerStateChangedListener(bg);
                    handler.removeCallbacksAndMessages(null);
                }
                c0125If.h = null;
            }
            c0125If.a = null;
            c0125If.b = null;
            r0(1);
        } finally {
            this.n.f();
            this.o.c();
            c1081nb.e();
        }
    }

    public final void M() {
        for (int i = 0; i < this.h.length; i++) {
            AbstractC0389a6 abstractC0389a6 = this.i[i];
            synchronized (abstractC0389a6.h) {
                abstractC0389a6.z = null;
            }
            HB hb = this.h[i];
            AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.e;
            QK.z(abstractC0389a62.o == 0);
            abstractC0389a62.q();
            hb.a = false;
            AbstractC0389a6 abstractC0389a63 = (AbstractC0389a6) hb.f;
            if (abstractC0389a63 != null) {
                QK.z(abstractC0389a63.o == 0);
                abstractC0389a63.q();
                hb.b = false;
            }
        }
    }

    public final void N(int i, int i2, GF gf) throws Throwable {
        this.P.f(1);
        C1359su c1359su = this.y;
        c1359su.getClass();
        QK.k(i >= 0 && i <= i2 && i2 <= ((ArrayList) c1359su.d).size());
        c1359su.l = gf;
        c1359su.h(i, i2);
        v(c1359su.c(), false);
    }

    /* JADX WARN: Removed duplicated region for block: B:82:0x0184  */
    /* JADX WARN: Removed duplicated region for block: B:99:? A[RETURN, SYNTHETIC] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void O() {
        int i;
        int i2;
        float f = this.t.b().a;
        Zt zt = this.f97x;
        Xt xt = zt.i;
        Xt xtF = zt.f();
        C0558dK c0558dK = null;
        Xt xt2 = xt;
        boolean z = true;
        while (xt2 != null && xt2.e) {
            Jx jx = this.O;
            C0558dK c0558dKJ = xt2.j(f, jx.a, jx.l);
            C0558dK c0558dK2 = xt2 == this.f97x.i ? c0558dKJ : c0558dK;
            C0558dK c0558dK3 = xt2.o;
            InterfaceC1608xj[] interfaceC1608xjArr = (InterfaceC1608xj[]) c0558dKJ.k;
            if (c0558dK3 != null && ((InterfaceC1608xj[]) c0558dK3.k).length == interfaceC1608xjArr.length) {
                for (int i3 = 0; i3 < interfaceC1608xjArr.length; i3++) {
                    if (c0558dKJ.n(c0558dK3, i3)) {
                    }
                }
                if (xt2 == xtF) {
                    z = false;
                }
                xt2 = xt2.m;
                c0558dK = c0558dK2;
            }
            if (!z) {
                i = 4;
                this.f97x.t(xt2);
                if (xt2.e) {
                    long jMax = Math.max(xt2.g.b, this.d0 - xt2.p);
                    if (this.F) {
                        int i4 = 0;
                        while (true) {
                            if (i4 >= this.h.length) {
                                break;
                            }
                            if (Objects.equals(this.f97x.k[i4], xt2) && this.h[i4].h(xt2)) {
                                f();
                                break;
                            }
                            i4++;
                        }
                    }
                    i2 = 4;
                    xt2.a(c0558dKJ, jMax, false, new boolean[xt2.j.length]);
                }
                u(true);
                if (this.O.e == i2) {
                    D();
                    E0();
                    this.n.h(2);
                    return;
                }
                return;
            }
            Zt zt2 = this.f97x;
            Xt xt3 = zt2.i;
            boolean z2 = (zt2.t(xt3) & 1) != 0;
            boolean[] zArr = new boolean[this.h.length];
            c0558dK2.getClass();
            long jA = xt3.a(c0558dK2, this.O.s, z2, zArr);
            Jx jx2 = this.O;
            boolean z3 = (jx2.e == 4 || jA == jx2.s) ? false : true;
            Jx jx3 = this.O;
            i = 4;
            this.O = y(jx3.b, jA, jx3.c, jx3.d, z3, 5);
            if (z3) {
                R(jA, true);
            }
            f();
            boolean[] zArr2 = new boolean[this.h.length];
            int i5 = 0;
            while (true) {
                HB[] hbArr = this.h;
                if (i5 >= hbArr.length) {
                    break;
                }
                int iC = hbArr[i5].c();
                zArr2[i5] = this.h[i5].j();
                HB hb = this.h[i5];
                WD wd = xt3.c[i5];
                C0465bf c0465bf = this.t;
                long j = this.d0;
                boolean z4 = zArr[i5];
                AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.e;
                if (HB.k(abstractC0389a6)) {
                    if (wd != abstractC0389a6.p) {
                        hb.a(abstractC0389a6, c0465bf);
                    } else if (z4) {
                        abstractC0389a6.z(j, false, true);
                    }
                }
                AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.f;
                if (abstractC0389a62 != null && HB.k(abstractC0389a62)) {
                    if (wd != abstractC0389a62.p) {
                        hb.a(abstractC0389a62, c0465bf);
                    } else if (z4) {
                        abstractC0389a62.z(j, false, true);
                    }
                }
                if (iC - this.h[i5].c() > 0) {
                    H(i5, false);
                }
                this.b0 -= iC - this.h[i5].c();
                i5++;
            }
            l(zArr2, this.d0);
            b0(xt3);
            i2 = i;
            u(true);
            if (this.O.e == i2) {
            }
        }
    }

    /* JADX WARN: Removed duplicated region for block: B:110:? A[RETURN, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:21:0x0058  */
    /* JADX WARN: Removed duplicated region for block: B:31:0x007f  */
    /* JADX WARN: Removed duplicated region for block: B:37:0x009d  */
    /* JADX WARN: Removed duplicated region for block: B:39:0x00a3  */
    /* JADX WARN: Removed duplicated region for block: B:43:0x00c8  */
    /* JADX WARN: Removed duplicated region for block: B:46:0x00db  */
    /* JADX WARN: Removed duplicated region for block: B:58:0x012d  */
    /* JADX WARN: Removed duplicated region for block: B:61:0x0137  */
    /* JADX WARN: Removed duplicated region for block: B:62:0x0139  */
    /* JADX WARN: Removed duplicated region for block: B:64:0x013e  */
    /* JADX WARN: Removed duplicated region for block: B:66:0x0143  */
    /* JADX WARN: Removed duplicated region for block: B:68:0x0148  */
    /* JADX WARN: Removed duplicated region for block: B:70:0x014d  */
    /* JADX WARN: Removed duplicated region for block: B:72:0x0152  */
    /* JADX WARN: Removed duplicated region for block: B:74:0x0159  */
    /* JADX WARN: Removed duplicated region for block: B:77:0x0180  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void P(boolean z, boolean z2, boolean z3, boolean z4) {
        long j;
        long j2;
        long j3;
        boolean z5;
        AbstractC1074nJ abstractC1074nJ;
        AbstractC1074nJ c0433az;
        C0480bu c0480bu;
        List list;
        this.n.g(2);
        this.L = false;
        if (this.M != null) {
            this.P.f(1);
            this.M = null;
        }
        this.h0 = null;
        G0(false, true);
        C0465bf c0465bf = this.t;
        c0465bf.m = false;
        WG wg = c0465bf.h;
        if (wg.i) {
            wg.c(wg.e());
            wg.i = false;
        }
        this.d0 = 1000000000000L;
        for (int i = 0; i < this.h.length; i++) {
            try {
                h(i);
            } catch (RuntimeException e) {
                e = e;
                AbstractC1578x4.u("ExoPlayerImplInternal", "Disable failed.", e);
                if (z) {
                }
                this.b0 = 0;
                Jx jx = this.O;
                C0480bu c0480bu2 = jx.b;
                long j4 = jx.s;
                if (!this.O.b.c()) {
                }
                if (z2) {
                }
                this.f97x.b();
                this.V = false;
                abstractC1074nJ = this.O.a;
                if (z3) {
                    c0433az = abstractC1074nJ;
                    c0480bu = c0480bu2;
                }
                Jx jx2 = this.O;
                int i2 = jx2.e;
                if (!z4) {
                }
                TJ tj = !z5 ? TJ.d : jx2.h;
                C0558dK c0558dK = !z5 ? this.l : jx2.i;
                if (z5) {
                }
                this.O = new Jx(c0433az, c0480bu, j3, j2, i2, c0348Xi, false, tj, c0558dK, list, c0480bu, jx2.l, jx2.m, jx2.n, jx2.o, j2, 0L, j2, 0L, false);
                if (z3) {
                }
            } catch (C0348Xi e2) {
                e = e2;
                AbstractC1578x4.u("ExoPlayerImplInternal", "Disable failed.", e);
                if (z) {
                }
                this.b0 = 0;
                Jx jx3 = this.O;
                C0480bu c0480bu22 = jx3.b;
                long j42 = jx3.s;
                if (!this.O.b.c()) {
                }
                if (z2) {
                }
                this.f97x.b();
                this.V = false;
                abstractC1074nJ = this.O.a;
                if (z3) {
                }
                Jx jx22 = this.O;
                int i22 = jx22.e;
                if (!z4) {
                }
                TJ tj2 = !z5 ? TJ.d : jx22.h;
                C0558dK c0558dK2 = !z5 ? this.l : jx22.i;
                if (z5) {
                }
                this.O = new Jx(c0433az, c0480bu, j3, j2, i22, c0348Xi, false, tj2, c0558dK2, list, c0480bu, jx22.l, jx22.m, jx22.n, jx22.o, j2, 0L, j2, 0L, false);
                if (z3) {
                }
            }
        }
        this.k0 = -9223372036854775807L;
        if (z) {
            for (HB hb : this.h) {
                try {
                    hb.n();
                } catch (RuntimeException e3) {
                    AbstractC1578x4.u("ExoPlayerImplInternal", "Reset failed.", e3);
                }
            }
        }
        this.b0 = 0;
        Jx jx32 = this.O;
        C0480bu c0480bu222 = jx32.b;
        long j422 = jx32.s;
        if (!this.O.b.c()) {
            Jx jx4 = this.O;
            C0970lJ c0970lJ = this.r;
            C0480bu c0480bu3 = jx4.b;
            AbstractC1074nJ abstractC1074nJ2 = jx4.a;
            j = (abstractC1074nJ2.p() || abstractC1074nJ2.g(c0480bu3.a, c0970lJ).f) ? this.O.c : this.O.s;
        }
        if (z2) {
            this.c0 = null;
            Pair pairN = n(this.O.a);
            c0480bu222 = (C0480bu) pairN.first;
            long jLongValue = ((Long) pairN.second).longValue();
            z5 = c0480bu222.equals(this.O.b) ? false : true;
            j2 = jLongValue;
            j3 = -9223372036854775807L;
        } else {
            j2 = j422;
            j3 = j;
            z5 = false;
        }
        this.f97x.b();
        this.V = false;
        abstractC1074nJ = this.O.a;
        if (z3 && (abstractC1074nJ instanceof C0433az)) {
            C0433az c0433az2 = (C0433az) abstractC1074nJ;
            GF gf = (GF) this.y.l;
            AbstractC1074nJ[] abstractC1074nJArr = c0433az2.h;
            AbstractC1074nJ[] abstractC1074nJArr2 = new AbstractC1074nJ[abstractC1074nJArr.length];
            for (int i3 = 0; i3 < abstractC1074nJArr.length; i3++) {
                abstractC1074nJArr2[i3] = new Zy(abstractC1074nJArr[i3]);
            }
            c0433az = new C0433az(abstractC1074nJArr2, c0433az2.i, gf);
            if (c0480bu222.b != -1) {
                c0433az.g(c0480bu222.a, this.r);
                int i4 = this.r.c;
                C1022mJ c1022mJ = this.q;
                c0433az.m(i4, c1022mJ, 0L);
                if (c1022mJ.a()) {
                    c0480bu = new C0480bu(c0480bu222.d, c0480bu222.a);
                }
            }
            Jx jx222 = this.O;
            int i222 = jx222.e;
            C0348Xi c0348Xi = !z4 ? null : jx222.f;
            TJ tj22 = !z5 ? TJ.d : jx222.h;
            C0558dK c0558dK22 = !z5 ? this.l : jx222.i;
            if (z5) {
                list = jx222.j;
            } else {
                C0475bp c0475bp = AbstractC0577dp.i;
                list = C1481vB.l;
            }
            this.O = new Jx(c0433az, c0480bu, j3, j2, i222, c0348Xi, false, tj22, c0558dK22, list, c0480bu, jx222.l, jx222.m, jx222.n, jx222.o, j2, 0L, j2, 0L, false);
            if (z3) {
                return;
            }
            Zt zt = this.f97x;
            if (!zt.q.isEmpty()) {
                ArrayList arrayList = new ArrayList();
                for (int i5 = 0; i5 < zt.q.size(); i5++) {
                    ((Xt) zt.q.get(i5)).i();
                }
                zt.q = arrayList;
                zt.m = null;
                zt.q();
            }
            C1359su c1359su = this.y;
            HashMap map = (HashMap) c1359su.g;
            for (C1256qu c1256qu : map.values()) {
                try {
                    c1256qu.a.o(c1256qu.b);
                } catch (RuntimeException e4) {
                    AbstractC1578x4.u("MediaSourceList", "Failed to release child source.", e4);
                }
                Y5 y5 = c1256qu.a;
                C1204pu c1204pu = c1256qu.c;
                y5.r(c1204pu);
                c1256qu.a.q(c1204pu);
            }
            map.clear();
            ((HashSet) c1359su.i).clear();
            c1359su.a = false;
            return;
        }
        c0433az = abstractC1074nJ;
        c0480bu = c0480bu222;
        Jx jx2222 = this.O;
        int i2222 = jx2222.e;
        if (!z4) {
        }
        TJ tj222 = !z5 ? TJ.d : jx2222.h;
        C0558dK c0558dK222 = !z5 ? this.l : jx2222.i;
        if (z5) {
        }
        this.O = new Jx(c0433az, c0480bu, j3, j2, i2222, c0348Xi, false, tj222, c0558dK222, list, c0480bu, jx2222.l, jx2222.m, jx2222.n, jx2222.o, j2, 0L, j2, 0L, false);
        if (z3) {
        }
    }

    public final void Q() {
        Xt xt = this.f97x.i;
        this.S = xt != null && xt.g.h && this.R;
    }

    public final void R(long j, boolean z) {
        Xt xt = this.f97x.i;
        long j2 = j + (xt == null ? 1000000000000L : xt.p);
        this.d0 = j2;
        this.t.h.c(j2);
        for (HB hb : this.h) {
            long j3 = this.d0;
            AbstractC0389a6 abstractC0389a6D = hb.d(xt);
            if (abstractC0389a6D != null) {
                abstractC0389a6D.z(j3, false, z);
            }
        }
        for (Xt xt2 = r0.i; xt2 != null; xt2 = xt2.m) {
            for (InterfaceC1608xj interfaceC1608xj : (InterfaceC1608xj[]) xt2.o.k) {
                if (interfaceC1608xj != null) {
                    interfaceC1608xj.r();
                }
            }
        }
    }

    public final void S(AbstractC1074nJ abstractC1074nJ, AbstractC1074nJ abstractC1074nJ2) {
        if (abstractC1074nJ.p() && abstractC1074nJ2.p()) {
            return;
        }
        ArrayList arrayList = this.u;
        int size = arrayList.size() - 1;
        if (size < 0) {
            Collections.sort(arrayList);
        } else {
            AbstractC0863jG.r(arrayList.get(size));
            throw null;
        }
    }

    /* JADX WARN: Removed duplicated region for block: B:16:0x002d  */
    /* JADX WARN: Removed duplicated region for block: B:19:0x0034  */
    /* JADX WARN: Removed duplicated region for block: B:30:0x0073  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void V(long j) {
        boolean z = this.C;
        long j2 = n0;
        if (z) {
            jMin = this.O.e != 3 ? j2 : 1000L;
            for (HB hb : this.h) {
                long j3 = this.d0;
                long j4 = this.e0;
                AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.f;
                AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.e;
                long jH = HB.k(abstractC0389a62) ? abstractC0389a62.h(j3, j4) : Long.MAX_VALUE;
                if (abstractC0389a6 != null && abstractC0389a6.o != 0) {
                    jH = Math.min(jH, abstractC0389a6.h(j3, j4));
                }
                jMin = Math.min(jMin, AbstractC1595xL.c0(jH));
            }
            if (this.O.m()) {
                Xt xt = this.f97x.i;
                if ((xt != null ? xt.m : null) != null) {
                    if ((AbstractC1595xL.P(jMin) * this.O.o.a) + this.d0 >= r1.e()) {
                        jMin = Math.min(jMin, j2);
                    }
                }
            }
        } else if (this.K) {
            this.J.getClass();
            if (this.O.e != 3) {
            }
            while (i < r4) {
            }
            if (this.O.m()) {
            }
        } else if (this.O.e != 3 || v0()) {
            jMin = j2;
        }
        this.n.a.sendEmptyMessageAtTime(2, j + jMin);
    }

    public final void W(boolean z) {
        C0480bu c0480bu = this.f97x.i.g.a;
        long jY = Y(c0480bu, this.O.s, true, false);
        if (jY != this.O.s) {
            Jx jx = this.O;
            this.O = y(c0480bu, jY, jx.c, jx.d, z, 5);
        }
    }

    /* JADX WARN: Can't wrap try/catch for region: R(13:39|(10:(9:113|41|(1:54)(3:47|(1:51)|52)|55|(1:62)|63|64|65|66)(1:70)|115|84|85|109|86|87|88|65|66)|107|71|(1:73)(1:75)|74|76|77|(1:80)|81|105|82|83) */
    /* JADX WARN: Code restructure failed: missing block: B:95:0x0193, code lost:
    
        r0 = th;
     */
    /* JADX WARN: Code restructure failed: missing block: B:97:0x0195, code lost:
    
        r9 = r7;
     */
    /* JADX WARN: Code restructure failed: missing block: B:98:0x0197, code lost:
    
        r0 = th;
     */
    /* JADX WARN: Code restructure failed: missing block: B:99:0x0198, code lost:
    
        r5 = r10;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void X(C1452uj c1452uj) throws Throwable {
        C0480bu c0480buV;
        boolean z;
        long jMax;
        long jLongValue;
        boolean z2;
        C0480bu c0480bu;
        long j;
        boolean z3;
        long j2;
        long jD;
        long j3;
        Jx jx;
        int i;
        long j4;
        int i2;
        long j5;
        C0480bu c0480bu2;
        long j6;
        long jY;
        Jx jx2;
        C0480bu c0480bu3;
        AbstractC1074nJ abstractC1074nJ;
        long j7;
        C1504vj c1504vj = this;
        if (c1504vj.L) {
            if (c1504vj.M != null) {
                c1504vj.N++;
                c1504vj.P.f(1);
            }
            c1504vj.M = c1452uj;
            return;
        }
        c1504vj.P.f(1);
        Pair pairT = T(c1504vj.O.a, c1452uj, true, c1504vj.W, c1504vj.X, c1504vj.q, c1504vj.r);
        if (pairT == null) {
            Pair pairN = c1504vj.n(c1504vj.O.a);
            c0480buV = (C0480bu) pairN.first;
            jLongValue = ((Long) pairN.second).longValue();
            z = !c1504vj.O.a.p();
            jMax = -9223372036854775807L;
        } else {
            Object obj = pairT.first;
            long jLongValue2 = ((Long) pairT.second).longValue();
            long j8 = c1452uj.c == -9223372036854775807L ? -9223372036854775807L : jLongValue2;
            Zt zt = c1504vj.f97x;
            Jx jx3 = c1504vj.O;
            c0480buV = zt.v(jx3, jx3.a, obj, jLongValue2, true, false);
            if (c0480buV.c()) {
                c1504vj.O.a.g(c0480buV.a, c1504vj.r);
                if (c1504vj.r.e(c0480buV.b) == c0480buV.c) {
                    c1504vj.r.g.getClass();
                }
                c1504vj.r.g.a(c0480buV.b).getClass();
                z = true;
                jMax = Math.max(j8, 0L);
                jLongValue = 0;
            } else {
                z = c1452uj.c == -9223372036854775807L;
                jMax = j8;
                jLongValue = jLongValue2;
            }
        }
        try {
            try {
                if (c1504vj.O.a.p()) {
                    c1504vj.c0 = c1452uj;
                } else if (pairT == null) {
                    if (c1504vj.O.e != 1) {
                        c1504vj.r0(4);
                    }
                    c1504vj.P(false, true, false, true);
                } else {
                    try {
                        try {
                            if (c0480buV.equals(c1504vj.O.b)) {
                                try {
                                    Xt xt = c1504vj.f97x.i;
                                    if (xt == null || !xt.e || jLongValue == 0) {
                                        jD = jLongValue;
                                    } else {
                                        C1409ts c1409ts = xt.a;
                                        long j9 = c1504vj.q.m;
                                        if (c1504vj.K && j9 != -9223372036854775807L) {
                                            c1504vj.J.getClass();
                                        }
                                        jD = c1409ts.d(jLongValue, c1504vj.I);
                                    }
                                    if (AbstractC1595xL.c0(jD) != AbstractC1595xL.c0(c1504vj.O.s) || ((i = (jx = c1504vj.O).e) != 2 && i != 3)) {
                                        z2 = z;
                                        c0480bu = c0480buV;
                                        j3 = jMax;
                                    }
                                    j4 = jx.s;
                                    i2 = 2;
                                    j5 = j4;
                                    z3 = z;
                                    c0480bu2 = c0480buV;
                                    j6 = jMax;
                                    c1504vj.O = c1504vj.y(c0480bu2, j4, j6, j5, z3, i2);
                                } catch (Throwable th) {
                                    th = th;
                                    boolean z4 = z;
                                    c0480bu = c0480buV;
                                    z3 = z4;
                                    j = jMax;
                                    j2 = jLongValue;
                                    c1504vj.O = c1504vj.y(c0480bu, j2, j, j2, z3, 2);
                                    throw th;
                                }
                            }
                            z2 = z;
                            c0480bu = c0480buV;
                            j3 = jMax;
                            jD = jLongValue;
                            c1504vj.F0(abstractC1074nJ, c0480bu3, abstractC1074nJ, jx2.b, j7, true);
                            c0480bu2 = c0480bu3;
                            j6 = j7;
                            j4 = jY;
                            i2 = 2;
                            j5 = j4;
                            c1504vj = this;
                            c1504vj.O = c1504vj.y(c0480bu2, j4, j6, j5, z3, i2);
                        } catch (Throwable th2) {
                            th = th2;
                            c0480bu = c0480bu3;
                            j = j7;
                            j2 = jY;
                            c1504vj.O = c1504vj.y(c0480bu, j2, j, j2, z3, 2);
                            throw th;
                        }
                        abstractC1074nJ = jx2.a;
                        j7 = j3;
                    } catch (Throwable th3) {
                        th = th3;
                        c0480bu = c0480bu3;
                        j = j3;
                        j2 = jY;
                        c1504vj.O = c1504vj.y(c0480bu, j2, j, j2, z3, 2);
                        throw th;
                    }
                    jY = c1504vj.Y(c0480bu, jD, c1504vj.A(), c1504vj.O.e == 4);
                    z3 = (jLongValue != jY) | z2;
                    jx2 = c1504vj.O;
                    c0480bu3 = c0480bu;
                }
                z3 = z;
                c0480bu2 = c0480buV;
                j4 = jLongValue;
                j6 = jMax;
                i2 = 2;
                j5 = j4;
                c1504vj = this;
                c1504vj.O = c1504vj.y(c0480bu2, j4, j6, j5, z3, i2);
            } catch (Throwable th4) {
                th = th4;
                z3 = z;
                c0480bu = c0480buV;
                j2 = jLongValue;
                j = jMax;
            }
        } catch (Throwable th5) {
            th = th5;
            z2 = z;
            c0480bu = c0480buV;
            j = jMax;
        }
    }

    /* JADX WARN: Removed duplicated region for block: B:71:0x0120  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final long Y(C0480bu c0480bu, long j, boolean z, boolean z2) {
        Zt zt;
        int i;
        z0();
        boolean z3 = true;
        G0(false, true);
        if (z2 || this.O.e == 3) {
            r0(2);
        }
        Xt xt = this.f97x.i;
        Xt xt2 = xt;
        while (xt2 != null && !c0480bu.equals(xt2.g.a)) {
            xt2 = xt2.m;
        }
        if (z || xt != xt2 || (xt2 != null && xt2.p + j < 0)) {
            for (int i2 = 0; i2 < this.h.length; i2++) {
                h(i2);
            }
            this.k0 = -9223372036854775807L;
            if (xt2 != null) {
                while (true) {
                    zt = this.f97x;
                    if (zt.i == xt2) {
                        break;
                    }
                    zt.a();
                }
                zt.t(xt2);
                xt2.p = 1000000000000L;
                QK.z(!A());
                l(new boolean[this.h.length], this.f97x.d().e());
                b0(xt2);
            }
        }
        f();
        if (this.K) {
            for (HB hb : this.h) {
                if (hb.j() && ((i = ((AbstractC0389a6) hb.e).i) == 2 || i == 4)) {
                    this.L = true;
                    break;
                }
            }
        }
        if (xt2 != null) {
            this.f97x.t(xt2);
            if (!xt2.e) {
                xt2.g = xt2.g.b(j, -9223372036854775807L);
            } else if (xt2.f) {
                if (this.K) {
                    this.J.getClass();
                    if (this.O.a.p() || !xt2.g.a.equals(this.O.b)) {
                        j = xt2.a.s(j);
                        xt2.a.t(j - this.s);
                    } else {
                        long j2 = xt2.p + j;
                        boolean z4 = true;
                        for (HB hb2 : this.h) {
                            if (hb2.j()) {
                                AbstractC0389a6 abstractC0389a6D = hb2.d(xt2);
                                z4 &= abstractC0389a6D != null && abstractC0389a6D.D(j2);
                            }
                        }
                        if (z4) {
                            C1409ts c1409ts = xt2.a;
                            long j3 = this.O.s;
                            C1640yE c1640yE = C1640yE.c;
                            if (c1409ts.d(j3, c1640yE) == xt2.a.d(j, c1640yE)) {
                                z3 = false;
                            }
                        }
                    }
                }
            }
            R(j, z3);
            D();
        } else {
            this.f97x.b();
            R(j, true);
        }
        u(false);
        this.n.h(2);
        return j;
    }

    public final void Z(Sy sy) {
        sy.getClass();
        C1696zI c1696zI = this.n;
        if (sy.e != this.p) {
            c1696zI.c(15, sy).b();
            return;
        }
        synchronized (sy) {
        }
        try {
            sy.a.c(sy.c, sy.d);
            sy.a(true);
            int i = this.O.e;
            if (i == 3 || i == 2) {
                c1696zI.h(2);
            }
        } catch (Throwable th) {
            sy.a(true);
            throw th;
        }
    }

    public final void a(C1296rj c1296rj, int i) throws Throwable {
        this.P.f(1);
        C1359su c1359su = this.y;
        if (i == -1) {
            i = ((ArrayList) c1359su.d).size();
        }
        v(c1359su.a(i, c1296rj.a, c1296rj.b), false);
    }

    public final void a0(Sy sy) {
        Looper looper = sy.e;
        if (looper.getThread().isAlive()) {
            this.v.a(looper, null).e(new N0(this, sy));
        } else {
            AbstractC1578x4.f0("TAG", "Trying to send message on a dead thread.");
            sy.a(false);
        }
    }

    @Override // x.ZL
    public final void b(long j, long j2, C0145Jk c0145Jk, MediaFormat mediaFormat) {
        if (this.L) {
            this.n.a(37).b();
        }
    }

    public final void b0(Xt xt) {
        for (int i = 0; i < this.h.length; i++) {
            xt.h[i] = true;
        }
    }

    public final void c() {
        for (HB hb : this.h) {
            C1328sE c1328sE = this.K ? this.J : null;
            ((AbstractC0389a6) hb.e).c(18, c1328sE);
            AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.f;
            if (abstractC0389a6 != null) {
                abstractC0389a6.c(18, c1328sE);
            }
        }
    }

    public final void c0(C0749h4 c0749h4, boolean z) {
        C0851j4 c0851j4;
        C1504vj c1504vj;
        C0125If c0125If = (C0125If) this.k;
        if (!c0125If.i.equals(c0749h4)) {
            c0125If.i = c0749h4;
            if (c0125If.f.B && Build.VERSION.SDK_INT >= 32 && (c0851j4 = c0125If.h) != null && c0851j4.h && (c1504vj = (C1504vj) c0125If.a) != null) {
                c1504vj.n.c(10, null).b();
            }
        }
        if (!z) {
            c0749h4 = null;
        }
        C1370t4 c1370t4 = this.G;
        if (!Objects.equals(c1370t4.d, c0749h4)) {
            c1370t4.d = c0749h4;
            int i = c0749h4 == null ? 0 : 1;
            c1370t4.f = i;
            QK.j("Automatic handling of audio focus is only available for USAGE_MEDIA and USAGE_GAME.", i == 1 || i == 0);
        }
        Jx jx = this.O;
        boolean z2 = jx.l;
        D0(c1370t4.d(jx.e, z2), jx.n, jx.m, z2);
    }

    public final boolean d() {
        if (!this.F) {
            return false;
        }
        for (HB hb : this.h) {
            if (hb.g()) {
                return true;
            }
        }
        return false;
    }

    public final void d0(int i) {
        for (HB hb : this.h) {
            AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.e;
            int i2 = abstractC0389a6.i;
            if (i2 == 1 || i2 == 2) {
                abstractC0389a6.c(10, Integer.valueOf(i));
                AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.f;
                if (abstractC0389a62 != null) {
                    abstractC0389a62.c(10, Integer.valueOf(i));
                }
            }
        }
    }

    public final void e() {
        O();
        W(true);
    }

    public final void e0(boolean z) {
        this.H = z;
    }

    public final void f() {
        AbstractC0389a6 abstractC0389a6;
        if (this.F && d()) {
            for (HB hb : this.h) {
                int iC = hb.c();
                C0465bf c0465bf = this.t;
                if (hb.g()) {
                    int i = hb.d;
                    boolean z = i == 4 || i == 2;
                    int i2 = i != 4 ? 0 : 1;
                    if (z) {
                        try {
                            abstractC0389a6 = (AbstractC0389a6) hb.e;
                        } catch (RuntimeException e) {
                            AbstractC1578x4.u("RendererHolder", "Disable prewarming failed.", e);
                        }
                    } else {
                        abstractC0389a6 = (AbstractC0389a6) hb.f;
                        abstractC0389a6.getClass();
                    }
                    hb.a(abstractC0389a6, c0465bf);
                    try {
                        hb.l(z);
                    } catch (RuntimeException e2) {
                        AbstractC1578x4.u("RendererHolder", "Reset prewarming failed.", e2);
                    }
                    hb.d = i2;
                }
                this.b0 -= iC - hb.c();
            }
            this.k0 = -9223372036854775807L;
        }
    }

    public final void f0(boolean z, C1081nb c1081nb) {
        if (this.Y != z) {
            this.Y = z;
            if (!z) {
                for (HB hb : this.h) {
                    hb.n();
                }
            }
        }
        if (c1081nb != null) {
            c1081nb.e();
        }
    }

    @Override // x.ZE
    public final void g(InterfaceC0398aF interfaceC0398aF) {
        this.n.c(9, (Wt) interfaceC0398aF).b();
    }

    public final void g0(C1193pj c1193pj) {
        for (HB hb : this.h) {
            AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.e;
            if (abstractC0389a6.i == 4) {
                abstractC0389a6.c(23, c1193pj);
                AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.f;
                if (abstractC0389a62 != null) {
                    abstractC0389a62.c(23, c1193pj);
                }
            }
        }
    }

    public final void h(int i) {
        HB[] hbArr = this.h;
        int iC = hbArr[i].c();
        HB hb = hbArr[i];
        AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.e;
        C0465bf c0465bf = this.t;
        hb.a(abstractC0389a6, c0465bf);
        AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.f;
        if (abstractC0389a62 != null) {
            boolean z = (abstractC0389a62.o == 0 || hb.d == 3) ? false : true;
            hb.a(abstractC0389a62, c0465bf);
            hb.l(false);
            if (z) {
                AbstractC0389a6 abstractC0389a63 = (AbstractC0389a6) hb.e;
                abstractC0389a62.getClass();
                abstractC0389a62.c(17, abstractC0389a63);
            }
        }
        hb.d = 0;
        H(i, false);
        this.b0 -= iC;
    }

    public final void h0(C1296rj c1296rj) throws Throwable {
        this.P.f(1);
        int i = c1296rj.c;
        GF gf = c1296rj.b;
        ArrayList arrayList = c1296rj.a;
        if (i != -1) {
            this.c0 = new C1452uj(new C0433az(arrayList, gf), c1296rj.c, c1296rj.d);
        }
        C1359su c1359su = this.y;
        ArrayList arrayList2 = (ArrayList) c1359su.d;
        c1359su.h(0, arrayList2.size());
        v(c1359su.a(arrayList2.size(), arrayList, gf), false);
    }

    @Override // android.os.Handler.Callback
    public final boolean handleMessage(Message message) throws Throwable {
        int i;
        C1696zI c1696zI;
        int i2;
        C0480bu c0480bu;
        try {
            switch (message.what) {
                case 1:
                    boolean z = message.arg1 != 0;
                    int i3 = message.arg2;
                    this.P.f(1);
                    D0(this.G.d(this.O.e, z), i3 >> 4, i3 & 15, z);
                    break;
                case 2:
                    j();
                    break;
                case 3:
                    X((C1452uj) message.obj);
                    break;
                case 4:
                    j0((Ox) message.obj);
                    break;
                case 5:
                    o0((C1640yE) message.obj);
                    break;
                case 6:
                    y0(false, true);
                    break;
                case 7:
                    L((C1081nb) message.obj);
                    return true;
                case 8:
                    w((Wt) message.obj);
                    break;
                case 9:
                    s((Wt) message.obj);
                    break;
                case 10:
                    this.k.i((C0455bK) message.obj);
                    O();
                    break;
                case 11:
                    l0(message.arg1);
                    break;
                case 12:
                    p0(message.arg1 != 0);
                    break;
                case 13:
                    f0(message.arg1 != 0, (C1081nb) message.obj);
                    break;
                case 14:
                    Z((Sy) message.obj);
                    break;
                case 15:
                    a0((Sy) message.obj);
                    break;
                case 16:
                    Ox ox = (Ox) message.obj;
                    x(ox, ox.a, true, false);
                    break;
                case 17:
                    h0((C1296rj) message.obj);
                    break;
                case 18:
                    a((C1296rj) message.obj, message.arg1);
                    break;
                case 19:
                    AbstractC0863jG.r(message.obj);
                    J();
                    throw null;
                case 20:
                    N(message.arg1, message.arg2, (GF) message.obj);
                    break;
                case 21:
                    q0((GF) message.obj);
                    break;
                case 22:
                    I();
                    break;
                case 23:
                    i0(message.arg1 != 0);
                    break;
                case 24:
                    e0(message.arg1 != 0);
                    break;
                case 25:
                    e();
                    break;
                case 26:
                    O();
                    W(true);
                    break;
                case 27:
                    C0(message.arg1, message.arg2, (List) message.obj);
                    break;
                case 28:
                    k0((C0417aj) message.obj);
                    break;
                case 29:
                    K();
                    break;
                case 30:
                    Pair pair = (Pair) message.obj;
                    t0(pair.first, (C1081nb) pair.second);
                    break;
                case 31:
                    c0((C0749h4) message.obj, message.arg1 != 0);
                    break;
                case 32:
                    u0(((Float) message.obj).floatValue());
                    break;
                case 33:
                    q(message.arg1);
                    break;
                case 34:
                    r();
                    break;
                case 35:
                    s0((ZL) message.obj);
                    break;
                case 36:
                    m0(((Boolean) message.obj).booleanValue());
                    break;
                case 37:
                    this.L = false;
                    C1452uj c1452uj = this.M;
                    if (c1452uj != null) {
                        X(c1452uj);
                        this.M = null;
                        break;
                    }
                    break;
                case 38:
                    n0((C1328sE) message.obj);
                    break;
                case 39:
                    g0((C1193pj) message.obj);
                    break;
                case 40:
                    d0(message.arg1);
                    break;
                default:
                    return false;
            }
        } catch (RuntimeException e) {
            C0348Xi c0348Xi = new C0348Xi(2, e, ((e instanceof IllegalStateException) || (e instanceof IllegalArgumentException)) ? 1004 : 1000);
            AbstractC1578x4.u("ExoPlayerImplInternal", "Playback error", c0348Xi);
            y0(true, false);
            this.O = this.O.f(c0348Xi);
        } catch (C0246Qg e2) {
            t(e2.h, e2);
        } catch (C0348Xi e3) {
            e = e3;
            int i4 = e.j;
            Zt zt = this.f97x;
            if (i4 == 1 && e.o == null) {
                HB hb = this.h[e.l];
                Xt xtK = zt.k();
                while (xtK != null && !hb.i(xtK)) {
                    xtK = xtK.m;
                }
                if (xtK == null) {
                    xtK = zt.d();
                }
                if (xtK != null) {
                    e = e.a(xtK.g.a);
                }
            }
            int i5 = e.l;
            int i6 = e.j;
            C1696zI c1696zI2 = this.n;
            if (i6 == 1 && (c0480bu = e.o) != null && B(i5, c0480bu)) {
                this.l0 = true;
                f();
                Xt xtL = zt.l(i5);
                Xt xtK2 = zt.k();
                if (zt.k() != xtL) {
                    while (xtK2 != null) {
                        Xt xt = xtK2.m;
                        if (xt == xtL) {
                            break;
                        }
                        xtK2 = xt;
                    }
                }
                zt.t(xtK2);
                if (this.O.e != 4) {
                    D();
                    c1696zI2.h(2);
                }
            } else {
                C0348Xi c0348Xi2 = this.h0;
                if (c0348Xi2 != null) {
                    c0348Xi2.addSuppressed(e);
                    e = this.h0;
                }
                if (e.j != 1 || zt.k() == zt.f()) {
                    c1696zI = c1696zI2;
                } else {
                    Xt xtK3 = zt.k();
                    while (xtK3 != null && !Objects.equals(xtK3.g.a, e.o)) {
                        xtK3 = xtK3.m;
                    }
                    if (xtK3 == null) {
                        xtK3 = zt.d();
                    }
                    while (!Objects.equals(zt.k(), xtK3)) {
                        zt.a();
                    }
                    Xt xtK4 = zt.k();
                    QK.u(xtK4);
                    F(message.what);
                    Yt yt = xtK4.g;
                    C0480bu c0480bu2 = yt.a;
                    long j = yt.b;
                    c1696zI = c1696zI2;
                    this.O = y(c0480bu2, j, yt.d, j, true, 0);
                }
                if (e.p && (this.h0 == null || (i2 = e.h) == 5004 || i2 == 5003)) {
                    AbstractC1578x4.g0("ExoPlayerImplInternal", "Recoverable renderer error", e);
                    if (this.h0 == null) {
                        this.h0 = e;
                    }
                    C1644yI c1644yIC = c1696zI.c(25, e);
                    Handler handler = c1696zI.a;
                    Message message2 = c1644yIC.a;
                    message2.getClass();
                    handler.sendMessageAtFrontOfQueue(message2);
                    c1644yIC.a();
                } else {
                    AbstractC1578x4.u("ExoPlayerImplInternal", "Playback error", e);
                    y0(true, false);
                    this.O = this.O.f(e);
                }
            }
        } catch (C1061n6 e4) {
            t(1002, e4);
        } catch (C1310rx e5) {
            boolean z2 = e5.h;
            int i7 = e5.i;
            if (i7 == 1) {
                i = z2 ? 3001 : 3003;
            } else {
                if (i7 == 4) {
                    i = z2 ? 3002 : 3004;
                }
                t(i, e5);
            }
            i = i;
            t(i, e5);
        } catch (C1498vd e6) {
            t(e6.h, e6);
        } catch (IOException e7) {
            t(2000, e7);
        }
        F(message.what);
        return true;
    }

    @Override // x.Vt
    public final void i(Wt wt) {
        this.n.c(8, wt).b();
    }

    public final void i0(boolean z) {
        this.R = z;
        Q();
        if (this.S && A()) {
            W(true);
            u(false);
        }
    }

    /*  JADX ERROR: JadxRuntimeException in pass: RegionMakerVisitor
        jadx.core.utils.exceptions.JadxRuntimeException: Not found exit edge by exit block: B:312:0x0572
        	at jadx.core.dex.visitors.regions.maker.LoopRegionMaker.checkLoopExits(LoopRegionMaker.java:225)
        	at jadx.core.dex.visitors.regions.maker.LoopRegionMaker.makeLoopRegion(LoopRegionMaker.java:195)
        	at jadx.core.dex.visitors.regions.maker.LoopRegionMaker.process(LoopRegionMaker.java:62)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.traverse(RegionMaker.java:89)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.makeRegion(RegionMaker.java:66)
        	at jadx.core.dex.visitors.regions.maker.IfRegionMaker.process(IfRegionMaker.java:95)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.traverse(RegionMaker.java:106)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.makeRegion(RegionMaker.java:66)
        	at jadx.core.dex.visitors.regions.maker.IfRegionMaker.process(IfRegionMaker.java:101)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.traverse(RegionMaker.java:106)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.makeRegion(RegionMaker.java:66)
        	at jadx.core.dex.visitors.regions.maker.IfRegionMaker.process(IfRegionMaker.java:95)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.traverse(RegionMaker.java:106)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.makeRegion(RegionMaker.java:66)
        	at jadx.core.dex.visitors.regions.maker.IfRegionMaker.process(IfRegionMaker.java:101)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.traverse(RegionMaker.java:106)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.makeRegion(RegionMaker.java:66)
        	at jadx.core.dex.visitors.regions.maker.IfRegionMaker.process(IfRegionMaker.java:101)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.traverse(RegionMaker.java:106)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.makeRegion(RegionMaker.java:66)
        	at jadx.core.dex.visitors.regions.maker.RegionMaker.makeMthRegion(RegionMaker.java:48)
        	at jadx.core.dex.visitors.regions.RegionMakerVisitor.visit(RegionMakerVisitor.java:25)
        */
    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Removed duplicated region for block: B:118:0x0252  */
    /* JADX WARN: Removed duplicated region for block: B:272:0x04d9  */
    /* JADX WARN: Removed duplicated region for block: B:279:0x04e9  */
    /* JADX WARN: Removed duplicated region for block: B:345:0x05dd  */
    /* JADX WARN: Removed duplicated region for block: B:645:0x04e4 A[SYNTHETIC] */
    /* JADX WARN: Type inference failed for: r13v1 */
    /* JADX WARN: Type inference failed for: r13v10 */
    /* JADX WARN: Type inference failed for: r13v2, types: [boolean, int] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void j() {
        /*
            Method dump skipped, instructions count: 2610
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: x.C1504vj.j():void");
    }

    public final void j0(Ox ox) {
        this.n.g(16);
        C0465bf c0465bf = this.t;
        c0465bf.d(ox);
        Ox oxB = c0465bf.b();
        x(oxB, oxB.a, true, true);
    }

    public final void k(Xt xt, int i, boolean z, long j) {
        HB hb = this.h[i];
        boolean zJ = hb.j();
        AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.e;
        if (zJ) {
            return;
        }
        boolean z2 = xt == this.f97x.i;
        C0558dK c0558dK = xt.o;
        GB gb = ((GB[]) c0558dK.j)[i];
        InterfaceC1608xj interfaceC1608xj = ((InterfaceC1608xj[]) c0558dK.k)[i];
        boolean z3 = v0() && this.O.e == 3;
        boolean z4 = !z && z3;
        this.b0++;
        WD wd = xt.c[i];
        long j2 = xt.p;
        C0480bu c0480bu = xt.g.a;
        AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.f;
        int length = interfaceC1608xj != null ? interfaceC1608xj.length() : 0;
        C0145Jk[] c0145JkArr = new C0145Jk[length];
        for (int i2 = 0; i2 < length; i2++) {
            interfaceC1608xj.getClass();
            c0145JkArr[i2] = interfaceC1608xj.c(i2);
        }
        int i3 = hb.d;
        C0465bf c0465bf = this.t;
        if (i3 == 0 || i3 == 2 || i3 == 4) {
            hb.a = true;
            QK.z(abstractC0389a6.o == 0);
            abstractC0389a6.k = gb;
            abstractC0389a6.f66x = c0480bu;
            abstractC0389a6.o = 1;
            abstractC0389a6.o(z4, z2);
            abstractC0389a6.y(c0145JkArr, wd, j, j2, c0480bu);
            abstractC0389a6.z(j, z4, true);
            c0465bf.c(abstractC0389a6);
        } else {
            hb.b = true;
            abstractC0389a62.getClass();
            QK.z(abstractC0389a62.o == 0);
            abstractC0389a62.k = gb;
            abstractC0389a62.f66x = c0480bu;
            abstractC0389a62.o = 1;
            abstractC0389a62.o(z4, z2);
            abstractC0389a62.y(c0145JkArr, wd, j, j2, c0480bu);
            abstractC0389a62.z(j, z4, true);
            c0465bf.c(abstractC0389a62);
        }
        C1245qj c1245qj = new C1245qj(this);
        AbstractC0389a6 abstractC0389a6D = hb.d(xt);
        abstractC0389a6D.getClass();
        abstractC0389a6D.c(11, c1245qj);
        if (z3 && z2) {
            hb.p();
        }
    }

    public final void k0(C0417aj c0417aj) {
        this.j0 = c0417aj;
        AbstractC1074nJ abstractC1074nJ = this.O.a;
        Zt zt = this.f97x;
        zt.getClass();
        c0417aj.getClass();
        if (zt.q.isEmpty()) {
            return;
        }
        ArrayList arrayList = new ArrayList();
        for (int i = 0; i < zt.q.size(); i++) {
            ((Xt) zt.q.get(i)).i();
        }
        zt.q = arrayList;
        zt.m = null;
        zt.q();
    }

    public final void l(boolean[] zArr, long j) {
        HB[] hbArr;
        long j2;
        QK.z(!A());
        Xt xtD = this.f97x.d();
        C0558dK c0558dK = xtD.o;
        int i = 0;
        while (true) {
            hbArr = this.h;
            if (i >= hbArr.length) {
                break;
            }
            if (!c0558dK.o(i)) {
                hbArr[i].n();
            }
            i++;
        }
        int i2 = 0;
        while (i2 < hbArr.length) {
            if (!c0558dK.o(i2) || hbArr[i2].i(xtD)) {
                j2 = j;
            } else {
                j2 = j;
                k(xtD, i2, zArr[i2], j2);
            }
            i2++;
            j = j2;
        }
    }

    public final void l0(int i) {
        this.W = i;
        AbstractC1074nJ abstractC1074nJ = this.O.a;
        Zt zt = this.f97x;
        zt.g = i;
        int iX = zt.x(abstractC1074nJ);
        if ((iX & 1) != 0) {
            W(true);
        } else if ((iX & 2) != 0) {
            f();
        }
        u(false);
    }

    public final long m(AbstractC1074nJ abstractC1074nJ, Object obj, long j) {
        C0970lJ c0970lJ = this.r;
        int i = abstractC1074nJ.g(obj, c0970lJ).c;
        C1022mJ c1022mJ = this.q;
        abstractC1074nJ.n(i, c1022mJ);
        if (c1022mJ.f != -9223372036854775807L && c1022mJ.a() && c1022mJ.i) {
            return AbstractC1595xL.P(AbstractC1595xL.B(c1022mJ.g) - c1022mJ.f) - (j + c0970lJ.e);
        }
        return -9223372036854775807L;
    }

    public final void m0(boolean z) throws Throwable {
        if (!z) {
            C1452uj c1452uj = this.M;
            C1696zI c1696zI = this.n;
            if (c1452uj != null && this.L && !c1696zI.a.hasMessages(37)) {
                this.N++;
            }
            int i = this.N;
            if (i > 0) {
                this.E.e(new N0(this, i));
            }
            this.N = 0;
            this.L = false;
            c1696zI.g(37);
            C1452uj c1452uj2 = this.M;
            if (c1452uj2 != null) {
                X(c1452uj2);
                this.M = null;
                this.L = false;
            }
        }
        this.K = z;
        c();
    }

    public final Pair n(AbstractC1074nJ abstractC1074nJ) {
        long j = 0;
        if (abstractC1074nJ.p()) {
            return Pair.create(Jx.u, 0L);
        }
        int iA = abstractC1074nJ.a(this.X);
        Pair pairI = abstractC1074nJ.i(this.q, this.r, iA, -9223372036854775807L);
        C0480bu c0480buV = this.f97x.v(this.O, abstractC1074nJ, pairI.first, 0L, true, false);
        long jLongValue = ((Long) pairI.second).longValue();
        if (c0480buV.c()) {
            Object obj = c0480buV.a;
            C0970lJ c0970lJ = this.r;
            abstractC1074nJ.g(obj, c0970lJ);
            if (c0480buV.c == c0970lJ.e(c0480buV.b)) {
                c0970lJ.g.getClass();
            }
        } else {
            j = jLongValue;
        }
        return Pair.create(c0480buV, Long.valueOf(j));
    }

    public final void n0(C1328sE c1328sE) {
        this.J = c1328sE;
        c();
    }

    public final long o(Xt xt, int i) {
        if (xt == null) {
            return 0L;
        }
        if (xt.e) {
            HB[] hbArr = this.h;
            if (hbArr[i].i(xt)) {
                AbstractC0389a6 abstractC0389a6D = hbArr[i].d(xt);
                Objects.requireNonNull(abstractC0389a6D);
                return abstractC0389a6D.t;
            }
        }
        return xt.p;
    }

    public final void o0(C1640yE c1640yE) {
        this.I = c1640yE;
    }

    public final long p(long j) {
        Xt xt = this.f97x.l;
        if (xt == null) {
            return 0L;
        }
        return Math.max(0L, j - (this.d0 - xt.p));
    }

    public final void p0(boolean z) {
        this.X = z;
        AbstractC1074nJ abstractC1074nJ = this.O.a;
        Zt zt = this.f97x;
        zt.h = z;
        int iX = zt.x(abstractC1074nJ);
        if ((iX & 1) != 0) {
            W(true);
        } else if ((iX & 2) != 0) {
            f();
        }
        u(false);
    }

    public final void q(int i) {
        Jx jx = this.O;
        D0(i, jx.n, jx.m, jx.l);
    }

    public final void q0(GF gf) throws Throwable {
        this.P.f(1);
        C1359su c1359su = this.y;
        int size = ((ArrayList) c1359su.d).size();
        if (gf.b.length != size) {
            gf = new GF(new Random(gf.a.nextLong())).a(size);
        }
        c1359su.l = gf;
        v(c1359su.c(), false);
    }

    public final void r() {
        u0(this.m0);
    }

    public final void r0(int i) {
        Jx jx = this.O;
        if (jx.e != i) {
            if (i != 2) {
                this.i0 = -9223372036854775807L;
            }
            if (i != 3 && jx.p) {
                this.O = jx.i(false);
            }
            this.O = this.O.h(i);
        }
    }

    public final void s(Wt wt) {
        Zt zt = this.f97x;
        Xt xt = zt.l;
        if (xt != null && xt.a == wt) {
            zt.s(this.d0);
            D();
            return;
        }
        Xt xt2 = zt.m;
        if (xt2 == null || xt2.a != wt) {
            return;
        }
        E();
    }

    public final void s0(ZL zl) {
        for (HB hb : this.h) {
            AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.e;
            int i = abstractC0389a6.i;
            if (i == 2 || i == 4) {
                abstractC0389a6.c(7, zl);
                AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.f;
                if (abstractC0389a62 != null) {
                    abstractC0389a62.c(7, zl);
                }
            }
        }
    }

    public final void t(int i, IOException iOException) {
        C0348Xi c0348Xi = new C0348Xi(0, iOException, i);
        Xt xt = this.f97x.i;
        if (xt != null) {
            c0348Xi = c0348Xi.a(xt.g.a);
        }
        AbstractC1578x4.u("ExoPlayerImplInternal", "Playback error", c0348Xi);
        y0(false, false);
        this.O = this.O.f(c0348Xi);
    }

    public final void t0(Object obj, C1081nb c1081nb) {
        for (HB hb : this.h) {
            AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.e;
            if (abstractC0389a6.i == 2) {
                int i = hb.d;
                if (i == 4 || i == 1) {
                    AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.f;
                    abstractC0389a62.getClass();
                    abstractC0389a62.c(1, obj);
                } else {
                    abstractC0389a6.c(1, obj);
                }
            }
        }
        int i2 = this.O.e;
        if (i2 == 3 || i2 == 2) {
            this.n.h(2);
        }
        if (c1081nb != null) {
            c1081nb.e();
        }
    }

    public final void u(boolean z) {
        Xt xt = this.f97x.l;
        C0480bu c0480bu = xt == null ? this.O.b : xt.g.a;
        boolean zEquals = this.O.k.equals(c0480bu);
        if (!zEquals) {
            this.O = this.O.c(c0480bu);
        }
        Jx jx = this.O;
        jx.q = xt == null ? jx.s : xt.d();
        Jx jx2 = this.O;
        jx2.r = p(jx2.q);
        if ((!zEquals || z) && xt != null && xt.e) {
            B0(xt.g.a, xt.o);
        }
    }

    public final void u0(float f) {
        this.m0 = f;
        float f2 = f * this.G.g;
        for (HB hb : this.h) {
            AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.e;
            if (abstractC0389a6.i == 1) {
                abstractC0389a6.c(2, Float.valueOf(f2));
                AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.f;
                if (abstractC0389a62 != null) {
                    abstractC0389a62.c(2, Float.valueOf(f2));
                }
            }
        }
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Removed duplicated region for block: B:139:0x02c0  */
    /* JADX WARN: Removed duplicated region for block: B:160:0x0313 A[PHI: r7
      0x0313: PHI (r7v13 x.nJ) = (r7v39 x.nJ), (r7v40 x.nJ), (r7v41 x.nJ) binds: [B:152:0x02f0, B:154:0x02f4, B:158:0x030e] A[DONT_GENERATE, DONT_INLINE]] */
    /* JADX WARN: Removed duplicated region for block: B:168:0x0332  */
    /* JADX WARN: Removed duplicated region for block: B:237:0x042d  */
    /* JADX WARN: Removed duplicated region for block: B:238:0x042f  */
    /* JADX WARN: Removed duplicated region for block: B:243:0x0448  */
    /* JADX WARN: Removed duplicated region for block: B:245:0x044e  */
    /* JADX WARN: Removed duplicated region for block: B:246:0x0451  */
    /* JADX WARN: Removed duplicated region for block: B:250:0x0478  */
    /* JADX WARN: Removed duplicated region for block: B:255:0x048f  */
    /* JADX WARN: Removed duplicated region for block: B:256:0x0491  */
    /* JADX WARN: Removed duplicated region for block: B:261:0x04a8  */
    /* JADX WARN: Removed duplicated region for block: B:263:0x04ae  */
    /* JADX WARN: Removed duplicated region for block: B:264:0x04b0  */
    /* JADX WARN: Removed duplicated region for block: B:268:0x04da  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public final void v(AbstractC1074nJ abstractC1074nJ, boolean z) throws Throwable {
        Zt zt;
        boolean z2;
        C0480bu c0480bu;
        long j;
        AbstractC1074nJ abstractC1074nJ2;
        C1022mJ c1022mJ;
        long jLongValue;
        int iA;
        long j2;
        int i;
        boolean z3;
        boolean z4;
        boolean z5;
        int iA2;
        boolean z6;
        Jx jx;
        C0970lJ c0970lJ;
        boolean z7;
        Zt zt2;
        long j3;
        AbstractC1074nJ abstractC1074nJ3;
        boolean z8;
        long jMin;
        long j4;
        int i2;
        AbstractC1074nJ abstractC1074nJ4;
        C1400tj c1400tj;
        int i3;
        long jLongValue2;
        boolean z9;
        boolean z10;
        boolean z11;
        boolean z12;
        AbstractC1074nJ abstractC1074nJ5;
        C0480bu c0480bu2;
        C0480bu c0480bu3;
        HB[] hbArr;
        C0480bu c0480bu4;
        boolean z13;
        long j5;
        long j6;
        Jx jx2 = this.O;
        C1452uj c1452uj = this.c0;
        Zt zt3 = this.f97x;
        int i4 = this.W;
        boolean z14 = this.X;
        C1022mJ c1022mJ2 = this.q;
        C0970lJ c0970lJ2 = this.r;
        boolean z15 = this.H;
        if (abstractC1074nJ.p()) {
            C0480bu c0480bu5 = Jx.u;
            boolean z16 = (c0480bu5.equals(jx2.b) && jx2.s == 0) ? false : true;
            abstractC1074nJ3 = abstractC1074nJ;
            c1400tj = new C1400tj(c0480bu5, 0L, -9223372036854775807L, false, true, false, z16, z16 && z && !jx2.a.p() && !jx2.a.g(jx2.b.a, c0970lJ2).f, 4);
        } else {
            C0480bu c0480bu6 = jx2.b;
            Object obj = c0480bu6.a;
            AbstractC1074nJ abstractC1074nJ6 = jx2.a;
            if (abstractC1074nJ6.p() || abstractC1074nJ6.g(c0480bu6.a, c0970lJ2).f) {
                zt = zt3;
                z2 = true;
            } else {
                zt = zt3;
                z2 = false;
            }
            long j7 = (jx2.b.c() || z2) ? jx2.c : jx2.s;
            if (c1452uj != null) {
                c0480bu = c0480bu6;
                j = 1;
                abstractC1074nJ2 = abstractC1074nJ;
                Pair pairT = T(abstractC1074nJ2, c1452uj, true, i4, z14, c1022mJ2, c0970lJ2);
                if (pairT == null) {
                    iA = abstractC1074nJ2.a(z14);
                    jLongValue2 = j7;
                    z12 = true;
                    z11 = false;
                    z10 = false;
                } else {
                    if (c1452uj.c == -9223372036854775807L) {
                        iA = abstractC1074nJ2.g(pairT.first, c0970lJ2).c;
                        jLongValue2 = j7;
                        z9 = false;
                    } else {
                        obj = pairT.first;
                        jLongValue2 = ((Long) pairT.second).longValue();
                        iA = -1;
                        z9 = true;
                    }
                    z10 = jx2.e == 4;
                    z11 = z9;
                    z12 = false;
                }
                z4 = z12;
                z5 = z11;
                z3 = z10;
                i = -1;
                long j8 = jLongValue2;
                c1022mJ = c1022mJ2;
                jLongValue = j8;
            } else {
                c0480bu = c0480bu6;
                j = 1;
                abstractC1074nJ2 = abstractC1074nJ;
                if (jx2.a.p()) {
                    iA = abstractC1074nJ2.a(z14);
                    c1022mJ = c1022mJ2;
                } else if (abstractC1074nJ2.b(obj) == -1) {
                    int iU = U(c1022mJ2, c0970lJ2, i4, z14, obj, jx2.a, abstractC1074nJ2);
                    c1022mJ = c1022mJ2;
                    abstractC1074nJ2 = abstractC1074nJ2;
                    c0970lJ2 = c0970lJ2;
                    if (iU == -1) {
                        iA2 = abstractC1074nJ2.a(z14);
                        z6 = true;
                    } else {
                        iA2 = iU;
                        z6 = false;
                    }
                    z4 = z6;
                    obj = obj;
                    iA = iA2;
                    jLongValue = j7;
                    i = -1;
                    z3 = false;
                    z5 = false;
                } else {
                    c1022mJ = c1022mJ2;
                    if (j7 == -9223372036854775807L) {
                        int i5 = abstractC1074nJ2.g(obj, c0970lJ2).c;
                        obj = obj;
                        iA = i5;
                    } else if (z2) {
                        jx2.a.g(c0480bu.a, c0970lJ2);
                        if (jx2.a.m(c0970lJ2.c, c1022mJ, 0L).n == jx2.a.b(c0480bu.a)) {
                            Pair pairI = abstractC1074nJ2.i(c1022mJ, c0970lJ2, abstractC1074nJ2.g(obj, c0970lJ2).c, j7 + c0970lJ2.e);
                            obj = pairI.first;
                            j2 = ((Long) pairI.second).longValue();
                        } else if (abstractC1074nJ2.g(obj, c0970lJ2).d != -9223372036854775807L) {
                            j2 = AbstractC1595xL.j(j7, 0L, c0970lJ2.d - 1);
                            obj = obj;
                        } else {
                            obj = obj;
                            j2 = j7;
                        }
                        jLongValue = j2;
                        iA = -1;
                        i = -1;
                        z3 = false;
                        z4 = false;
                        z5 = true;
                    } else {
                        obj = obj;
                        jLongValue = j7;
                        iA = -1;
                        i = -1;
                        z3 = false;
                        z4 = false;
                        z5 = false;
                    }
                }
                jLongValue = j7;
                i = -1;
                z3 = false;
                z4 = false;
                z5 = false;
            }
            if (iA != i) {
                Pair pairI2 = abstractC1074nJ2.i(c1022mJ, c0970lJ2, iA, -9223372036854775807L);
                obj = pairI2.first;
                jLongValue = ((Long) pairI2.second).longValue();
                jx = jx2;
                c0970lJ = c0970lJ2;
                z7 = z15;
                zt2 = zt;
                j3 = -9223372036854775807L;
            } else {
                jx = jx2;
                c0970lJ = c0970lJ2;
                z7 = z15;
                zt2 = zt;
                j3 = jLongValue;
            }
            Object obj2 = obj;
            C0480bu c0480buV = zt2.v(jx, abstractC1074nJ, obj2, jLongValue, z7, z2);
            Jx jx3 = jx;
            abstractC1074nJ3 = abstractC1074nJ;
            int i6 = c0480buV.e;
            boolean z17 = i6 == i || ((i3 = c0480bu.e) != i && i6 >= i3);
            boolean zEquals = c0480bu.a.equals(obj2);
            boolean z18 = zEquals && !c0480bu.c() && !c0480buV.c() && z17;
            C0970lJ c0970lJG = abstractC1074nJ3.g(obj2, c0970lJ);
            if (z2 || j7 != j3) {
                z8 = z18;
            } else {
                Object obj3 = c0480bu.a;
                int i7 = c0480bu.b;
                z8 = z18;
                if (obj3.equals(c0480buV.a)) {
                    if (c0480bu.c()) {
                        c0970lJG.g(i7);
                    }
                    if (c0480buV.c()) {
                        c0970lJG.g(c0480buV.b);
                    }
                }
            }
            if (z8) {
                c0480buV = c0480bu;
            }
            if (c0480buV.c()) {
                if (c0480buV.equals(c0480bu)) {
                    j4 = j3;
                    jMin = jx3.s;
                } else {
                    abstractC1074nJ3.g(c0480buV.a, c0970lJ);
                    if (c0480buV.c == c0970lJ.e(c0480buV.b)) {
                        c0970lJ.g.getClass();
                    }
                    j4 = j3;
                    jMin = 0;
                }
            } else if (zEquals && c0480bu.c()) {
                V0 v0A = abstractC1074nJ3.g(obj2, c0970lJ).g.a(c0480bu.b);
                v0A.getClass();
                long j9 = jx3.c;
                if (j9 == -9223372036854775807L || 0 > j9) {
                    int i8 = v0A.a;
                    int i9 = c0480bu.c;
                    if (i8 > i9 && v0A.e[i9] == 2) {
                        long j10 = abstractC1074nJ3.g(obj2, c0970lJ).d;
                        jMin = j10 != -9223372036854775807L ? Math.min(j10 - j, jLongValue) : jLongValue;
                        j4 = jMin;
                    }
                }
            } else {
                jMin = jLongValue;
                j4 = j3;
            }
            boolean z19 = (c0480buV.equals(jx3.b) && jMin == jx3.s) ? false : true;
            int i10 = abstractC1074nJ3.b(jx3.b.a) == -1 ? 4 : 3;
            Object obj4 = c0480buV.a;
            Object obj5 = jx3.b.a;
            boolean zEquals2 = obj4.equals(obj5);
            AbstractC1074nJ abstractC1074nJ7 = obj5;
            if (zEquals2) {
                abstractC1074nJ7 = obj5;
                if (c0480buV.b != -1) {
                    V0 v0A2 = abstractC1074nJ3.g(c0480buV.a, c0970lJ).g.a(c0480buV.b);
                    int i11 = c0480buV.c;
                    int[] iArr = v0A2.e;
                    if (i11 < iArr.length) {
                        int i12 = iArr[i11];
                        abstractC1074nJ7 = i11;
                        if (i12 == 2) {
                            i2 = i10;
                            abstractC1074nJ4 = abstractC1074nJ7;
                        }
                        c1400tj = new C1400tj(c0480buV, jMin, j4, z3, z4, z5, z19, (z19 || !z || jx3.a.p() || jx3.a.g(jx3.b.a, c0970lJ).f) ? false : true, i2);
                    }
                    i2 = 0;
                    abstractC1074nJ4 = i11;
                    if (z19) {
                        c1400tj = new C1400tj(c0480buV, jMin, j4, z3, z4, z5, z19, (z19 || !z || jx3.a.p() || jx3.a.g(jx3.b.a, c0970lJ).f) ? false : true, i2);
                    }
                }
            }
        }
        C0480bu c0480bu7 = c1400tj.a;
        long jY = c1400tj.b;
        try {
            if (c1400tj.e) {
                if (this.O.e != 1) {
                    r0(4);
                }
                P(false, false, false, true);
            }
            HB[] hbArr2 = this.h;
            int length = hbArr2.length;
            int i13 = 0;
            AbstractC1074nJ abstractC1074nJ8 = abstractC1074nJ4;
            while (i13 < length) {
                HB hb = hbArr2[i13];
                AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.e;
                boolean zEquals3 = Objects.equals(abstractC0389a6.w, abstractC1074nJ3);
                if (zEquals3 == 0) {
                    abstractC0389a6.w = abstractC1074nJ3;
                    abstractC0389a6.E();
                    abstractC0389a6.v();
                }
                AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.f;
                if (abstractC0389a62 != null && !Objects.equals(abstractC0389a62.w, abstractC1074nJ3)) {
                    abstractC0389a62.w = abstractC1074nJ3;
                    abstractC0389a62.E();
                    abstractC0389a62.v();
                }
                i13++;
                abstractC1074nJ8 = zEquals3;
            }
            try {
                if (c1400tj.g) {
                    AbstractC1074nJ abstractC1074nJ9 = abstractC1074nJ3;
                    if (!abstractC1074nJ9.p()) {
                        try {
                            for (Xt xt = this.f97x.i; xt != null; xt = xt.m) {
                                if (xt.g.a.equals(c0480bu7)) {
                                    xt.g = this.f97x.m(abstractC1074nJ9, xt.g);
                                }
                            }
                            c0480bu2 = c0480bu7;
                        } catch (Throwable th) {
                            th = th;
                            c0480bu2 = c0480bu7;
                        }
                        try {
                            jY = Y(c0480bu2, jY, A(), c1400tj.d);
                        } catch (Throwable th2) {
                            th = th2;
                            jY = jY;
                            abstractC1074nJ5 = abstractC1074nJ9;
                            Jx jx4 = this.O;
                            AbstractC1074nJ abstractC1074nJ10 = jx4.a;
                            C0480bu c0480bu8 = jx4.b;
                            c0480bu3 = c0480bu2;
                            F0(abstractC1074nJ5, c0480bu3, abstractC1074nJ10, c0480bu8, !c1400tj.f ? jY : -9223372036854775807L, false);
                            if (!c1400tj.g) {
                                long j11 = c1400tj.c;
                                boolean z20 = c1400tj.h;
                                this.O = y(c0480bu3, jY, j11, !z20 ? jY : this.O.d, z20, c1400tj.i);
                            }
                            Q();
                            S(abstractC1074nJ5, this.O.a);
                            this.O = this.O.j(abstractC1074nJ5);
                            if (!abstractC1074nJ5.p()) {
                            }
                            u(false);
                            this.n.h(2);
                            throw th;
                        }
                    }
                    Jx jx5 = this.O;
                    c0480bu4 = c0480bu2;
                    F0(abstractC1074nJ, c0480bu4, jx5.a, jx5.b, !c1400tj.f ? jY : -9223372036854775807L, false);
                    if (!c1400tj.g || c1400tj.c != this.O.c) {
                        long j12 = c1400tj.c;
                        z13 = c1400tj.h;
                        if (z13) {
                            j5 = this.O.d;
                            j6 = jY;
                        } else {
                            j6 = jY;
                            j5 = j6;
                        }
                        this.O = y(c0480bu4, j6, j12, j5, z13, c1400tj.i);
                    }
                    Q();
                    S(abstractC1074nJ, this.O.a);
                    this.O = this.O.j(abstractC1074nJ);
                    if (!abstractC1074nJ.p()) {
                        this.c0 = null;
                    }
                    u(false);
                    this.n.h(2);
                }
                try {
                    long[] jArr = new long[this.h.length];
                    int i14 = 0;
                    while (true) {
                        hbArr = this.h;
                        if (i14 >= hbArr.length) {
                            break;
                        }
                        jArr[i14] = o(this.f97x.j[i14], i14);
                        i14++;
                    }
                    long[] jArr2 = new long[hbArr.length];
                    for (int i15 = 0; i15 < this.h.length; i15++) {
                        jArr2[i15] = o(this.f97x.k[i15], i15);
                    }
                    int iY = this.f97x.y(abstractC1074nJ3, this.d0, jArr, jArr2);
                    if ((iY & 1) != 0) {
                        W(false);
                    } else if ((iY & 2) != 0) {
                        f();
                    }
                } catch (Throwable th3) {
                    th = th3;
                    abstractC1074nJ8 = abstractC1074nJ3;
                    abstractC1074nJ5 = abstractC1074nJ8;
                    c0480bu2 = c0480bu7;
                    Jx jx42 = this.O;
                    AbstractC1074nJ abstractC1074nJ102 = jx42.a;
                    C0480bu c0480bu82 = jx42.b;
                    c0480bu3 = c0480bu2;
                    F0(abstractC1074nJ5, c0480bu3, abstractC1074nJ102, c0480bu82, !c1400tj.f ? jY : -9223372036854775807L, false);
                    if (!c1400tj.g || c1400tj.c != this.O.c) {
                        long j112 = c1400tj.c;
                        boolean z202 = c1400tj.h;
                        this.O = y(c0480bu3, jY, j112, !z202 ? jY : this.O.d, z202, c1400tj.i);
                    }
                    Q();
                    S(abstractC1074nJ5, this.O.a);
                    this.O = this.O.j(abstractC1074nJ5);
                    if (!abstractC1074nJ5.p()) {
                        this.c0 = null;
                    }
                    u(false);
                    this.n.h(2);
                    throw th;
                }
                c0480bu2 = c0480bu7;
                Jx jx52 = this.O;
                c0480bu4 = c0480bu2;
                F0(abstractC1074nJ, c0480bu4, jx52.a, jx52.b, !c1400tj.f ? jY : -9223372036854775807L, false);
                if (!c1400tj.g) {
                    long j122 = c1400tj.c;
                    z13 = c1400tj.h;
                    if (z13) {
                    }
                    this.O = y(c0480bu4, j6, j122, j5, z13, c1400tj.i);
                }
                Q();
                S(abstractC1074nJ, this.O.a);
                this.O = this.O.j(abstractC1074nJ);
                if (!abstractC1074nJ.p()) {
                }
                u(false);
                this.n.h(2);
            } catch (Throwable th4) {
                th = th4;
            }
        } catch (Throwable th5) {
            th = th5;
            abstractC1074nJ5 = abstractC1074nJ3;
        }
    }

    public final boolean v0() {
        Jx jx = this.O;
        return jx.l && jx.n == 0;
    }

    public final void w(Wt wt) {
        Xt xt;
        Zt zt = this.f97x;
        Xt xt2 = zt.l;
        C0465bf c0465bf = this.t;
        if (xt2 != null && xt2.a == wt) {
            xt2.getClass();
            if (!xt2.e) {
                float f = c0465bf.b().a;
                Jx jx = this.O;
                xt2.f(f, jx.a, jx.l);
            }
            B0(xt2.g.a, xt2.o);
            if (xt2 == zt.i) {
                R(xt2.g.b, true);
                QK.z(!A());
                l(new boolean[this.h.length], zt.d().e());
                b0(xt2);
                Jx jx2 = this.O;
                C0480bu c0480bu = jx2.b;
                long j = xt2.g.b;
                this.O = y(c0480bu, j, jx2.c, j, false, 5);
            }
            D();
            return;
        }
        int i = 0;
        while (true) {
            if (i >= zt.q.size()) {
                xt = null;
                break;
            }
            xt = (Xt) zt.q.get(i);
            if (xt.a == wt) {
                break;
            } else {
                i++;
            }
        }
        if (xt != null) {
            QK.z(true ^ xt.e);
            float f2 = c0465bf.b().a;
            Jx jx3 = this.O;
            xt.f(f2, jx3.a, jx3.l);
            Xt xt3 = zt.m;
            if (xt3 == null || xt3.a != wt) {
                return;
            }
            E();
        }
    }

    public final boolean w0(AbstractC1074nJ abstractC1074nJ, C0480bu c0480bu) {
        if (c0480bu.c() || abstractC1074nJ.p()) {
            return false;
        }
        int i = abstractC1074nJ.g(c0480bu.a, this.r).c;
        C1022mJ c1022mJ = this.q;
        abstractC1074nJ.n(i, c1022mJ);
        return c1022mJ.a() && c1022mJ.i && c1022mJ.f != -9223372036854775807L;
    }

    public final void x(Ox ox, float f, boolean z, boolean z2) {
        int i;
        if (z) {
            if (z2) {
                this.P.f(1);
            }
            this.O = this.O.g(ox);
        }
        float f2 = ox.a;
        Xt xt = this.f97x.i;
        while (true) {
            i = 0;
            if (xt == null) {
                break;
            }
            InterfaceC1608xj[] interfaceC1608xjArr = (InterfaceC1608xj[]) xt.o.k;
            int length = interfaceC1608xjArr.length;
            while (i < length) {
                InterfaceC1608xj interfaceC1608xj = interfaceC1608xjArr[i];
                if (interfaceC1608xj != null) {
                    interfaceC1608xj.p(f2);
                }
                i++;
            }
            xt = xt.m;
        }
        HB[] hbArr = this.h;
        int length2 = hbArr.length;
        while (i < length2) {
            HB hb = hbArr[i];
            float f3 = ox.a;
            ((AbstractC0389a6) hb.e).A(f, f3);
            AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.f;
            if (abstractC0389a6 != null) {
                abstractC0389a6.A(f, f3);
            }
            i++;
        }
    }

    public final void x0() {
        Xt xt = this.f97x.i;
        if (xt == null) {
            return;
        }
        C0558dK c0558dK = xt.o;
        int i = 0;
        while (true) {
            HB[] hbArr = this.h;
            if (i >= hbArr.length) {
                return;
            }
            if (c0558dK.o(i)) {
                hbArr[i].p();
            }
            i++;
        }
    }

    public final Jx y(C0480bu c0480bu, long j, long j2, long j3, boolean z, int i) {
        C1481vB c1481vBF;
        Xt xt;
        boolean z2;
        this.g0 = (!this.g0 && j == this.O.s && c0480bu.equals(this.O.b)) ? false : true;
        Q();
        Jx jx = this.O;
        TJ tj = jx.h;
        C0558dK c0558dK = jx.i;
        List list = jx.j;
        if (this.y.a) {
            Xt xt2 = this.f97x.i;
            tj = xt2 == null ? TJ.d : xt2.n;
            c0558dK = xt2 == null ? this.l : xt2.o;
            InterfaceC1608xj[] interfaceC1608xjArr = (InterfaceC1608xj[]) c0558dK.k;
            C0423ap c0423ap = new C0423ap(4);
            boolean z3 = false;
            for (InterfaceC1608xj interfaceC1608xj : interfaceC1608xjArr) {
                if (interfaceC1608xj != null) {
                    C0429av c0429av = interfaceC1608xj.c(0).m;
                    if (c0429av == null) {
                        c0423ap.b(new C0429av(new Zu[0]));
                    } else {
                        c0423ap.b(c0429av);
                        z3 = true;
                    }
                }
            }
            if (z3) {
                c1481vBF = c0423ap.f();
            } else {
                C0475bp c0475bp = AbstractC0577dp.i;
                c1481vBF = C1481vB.l;
            }
            list = c1481vBF;
            if (xt2 != null) {
                Yt yt = xt2.g;
                if (yt.d != j2) {
                    xt2.g = yt.a(j2);
                }
            }
            HB[] hbArr = this.h;
            if (!A() && (xt = this.f97x.i) != null) {
                C0558dK c0558dK2 = xt.o;
                int i2 = 0;
                boolean z4 = false;
                while (true) {
                    if (i2 >= hbArr.length) {
                        z2 = true;
                        break;
                    }
                    if (c0558dK2.o(i2)) {
                        if (((AbstractC0389a6) hbArr[i2].e).i != 1) {
                            z2 = false;
                            break;
                        }
                        if (((GB[]) c0558dK2.j)[i2].a != 0) {
                            z4 = true;
                        }
                    }
                    i2++;
                }
                boolean z5 = z4 && z2;
                if (z5 != this.a0) {
                    this.a0 = z5;
                    if (!z5 && this.O.p) {
                        this.n.h(2);
                    }
                }
            }
        } else if (!c0480bu.equals(jx.b)) {
            tj = TJ.d;
            c0558dK = this.l;
            list = C1481vB.l;
        }
        TJ tj2 = tj;
        C0558dK c0558dK3 = c0558dK;
        List list2 = list;
        if (z) {
            C1348sj c1348sj = this.P;
            if (!c1348sj.e || c1348sj.c == 5) {
                c1348sj.d = true;
                c1348sj.e = true;
                c1348sj.c = i;
            } else {
                QK.k(i == 5);
            }
        }
        Jx jx2 = this.O;
        return jx2.d(c0480bu, j, j2, j3, p(jx2.q), tj2, c0558dK3, list2);
    }

    public final void y0(boolean z, boolean z2) {
        P(z || !this.Y, false, true, false);
        this.P.f(z2 ? 1 : 0);
        C0413af c0413af = (C0413af) this.m;
        ConcurrentHashMap concurrentHashMap = c0413af.q;
        Py py = this.B;
        C0372Ze c0372Ze = (C0372Ze) concurrentHashMap.get(py);
        if (c0372Ze != null) {
            int i = c0372Ze.a - 1;
            c0372Ze.a = i;
            if (i == 0) {
                concurrentHashMap.remove(py);
                c0413af.d();
            }
        }
        this.G.d(1, this.O.l);
        r0(1);
    }

    public final void z0() {
        C0465bf c0465bf = this.t;
        c0465bf.m = false;
        WG wg = c0465bf.h;
        if (wg.i) {
            wg.c(wg.e());
            wg.i = false;
        }
        for (HB hb : this.h) {
            AbstractC0389a6 abstractC0389a6 = (AbstractC0389a6) hb.f;
            AbstractC0389a6 abstractC0389a62 = (AbstractC0389a6) hb.e;
            if (HB.k(abstractC0389a62)) {
                HB.b(abstractC0389a62);
            }
            if (abstractC0389a6 != null && abstractC0389a6.o != 0) {
                HB.b(abstractC0389a6);
            }
        }
    }
}
