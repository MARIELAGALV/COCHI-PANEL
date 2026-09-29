package x;

import android.os.Build;
import android.os.Looper;

/* renamed from: x.Zi, reason: case insensitive filesystem */
/* loaded from: classes.dex */
public final class C0376Zi {
    public static final int D;
    public static final boolean E;
    public final String A;
    public final boolean B;
    public final boolean C;
    public final W1 a;
    public final C1592xI b;
    public final C0362Yi c;
    public InterfaceC0659fI d;
    public final C0362Yi e;
    public InterfaceC0659fI f;
    public final C0362Yi g;
    public final Looper h;
    public final int i;
    public final C0749h4 j;
    public final int k;
    public final boolean l;
    public final C1640yE m;
    public final C1328sE n;
    public long o;
    public long p;
    public final long q;
    public final C0358Ye r;
    public final long s;
    public final long t;
    public final int u;
    public final int v;
    public final int w;

    /* renamed from: x, reason: collision with root package name */
    public final int f64x;
    public final boolean y;
    public boolean z;

    static {
        String str = AbstractC1595xL.a;
        String strX = AbstractC1496vb.X(Build.DEVICE);
        D = (strX.contains("emulator") || strX.contains("emu64a") || strX.contains("emu64x") || strX.contains("generic") || strX.contains("vsoc")) ? 30000 : 10000;
        E = true;
    }

    public C0376Zi(W1 w1) {
        C0362Yi c0362Yi = new C0362Yi(w1, 0);
        C0362Yi c0362Yi2 = new C0362Yi(w1, 1);
        C0362Yi c0362Yi3 = new C0362Yi(w1, 2);
        C0852j5 c0852j5 = new C0852j5(2);
        C0362Yi c0362Yi4 = new C0362Yi(w1, 3);
        this.a = w1;
        this.c = c0362Yi;
        this.d = c0362Yi2;
        this.e = c0362Yi3;
        this.f = c0852j5;
        this.g = c0362Yi4;
        this.h = AbstractC1595xL.w();
        this.j = C0749h4.b;
        this.k = 1;
        this.l = true;
        this.m = C1640yE.d;
        this.o = 5000L;
        this.p = 15000L;
        this.q = 3000L;
        this.n = C1328sE.b;
        this.r = new C0358Ye(AbstractC1595xL.P(20L), AbstractC1595xL.P(500L));
        this.b = C1592xI.a;
        this.s = 500L;
        this.t = 2000L;
        this.u = 600000;
        boolean z = E;
        this.v = z ? D : Integer.MAX_VALUE;
        this.w = z ? 60000 : Integer.MAX_VALUE;
        this.f64x = 600000;
        this.y = true;
        this.A = "";
        this.i = -1000;
        new C0300Uc();
        this.B = true;
        this.C = true;
    }
}
