package x;

import android.net.Uri;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;

/* renamed from: x.ef, reason: case insensitive filesystem */
/* loaded from: classes.dex */
public final class C0619ef implements InterfaceC0428au {
    public final C0568df a;
    public final InterfaceC1342sd b;
    public C0300Uc c;
    public final long d;
    public final long e;
    public final long f;
    public final float g;
    public final float h;
    public boolean i;

    public C0619ef(C0139Je c0139Je) {
        this(c0139Je, new C0019Be());
    }

    public static InterfaceC0428au g(Class cls, InterfaceC1342sd interfaceC1342sd) {
        try {
            return (InterfaceC0428au) cls.getConstructor(InterfaceC1342sd.class).newInstance(interfaceC1342sd);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @Override // x.InterfaceC0428au
    public final InterfaceC0428au a(boolean z) {
        this.i = z;
        C0568df c0568df = this.a;
        c0568df.e = z;
        C0019Be c0019Be = c0568df.a;
        synchronized (c0019Be) {
            c0019Be.b = z;
        }
        Iterator it = c0568df.c.values().iterator();
        while (it.hasNext()) {
            ((InterfaceC0428au) it.next()).a(z);
        }
        return this;
    }

    @Override // x.InterfaceC0428au
    public final /* bridge */ /* synthetic */ InterfaceC0428au b(C1725zw c1725zw) {
        i(c1725zw);
        return this;
    }

    @Override // x.InterfaceC0428au
    public final /* bridge */ /* synthetic */ InterfaceC0428au c(InterfaceC0360Yg interfaceC0360Yg) {
        h(interfaceC0360Yg);
        return this;
    }

    @Override // x.InterfaceC0428au
    public final Y5 d(Nt nt) {
        Nt nt2;
        Uri uri;
        String str;
        List list;
        long j;
        nt.b.getClass();
        String scheme = nt.b.a.getScheme();
        if (scheme != null && scheme.equals("ssai")) {
            throw null;
        }
        if (Objects.equals(nt.b.b, "application/x-image-uri")) {
            long j2 = nt.b.e;
            String str2 = AbstractC1595xL.a;
            throw null;
        }
        Kt kt = nt.b;
        int I = AbstractC1595xL.I(kt.a, kt.b);
        if (nt.b.e != -9223372036854775807L) {
            C0019Be c0019Be = this.a.a;
            synchronized (c0019Be) {
                c0019Be.e = 1;
            }
            C0568df.a(this.a);
        }
        try {
            InterfaceC0428au interfaceC0428auB = this.a.b(I);
            It itA = nt.c.a();
            Jt jt = nt.c;
            if (jt.a == -9223372036854775807L) {
                itA.a = this.d;
            }
            if (jt.d == -3.4028235E38f) {
                itA.d = this.g;
            }
            if (jt.e == -3.4028235E38f) {
                itA.e = this.h;
            }
            if (jt.b == -9223372036854775807L) {
                itA.b = this.e;
            }
            if (jt.c == -9223372036854775807L) {
                itA.c = this.f;
            }
            Jt jt2 = new Jt(itA);
            if (jt2.equals(nt.c)) {
                nt2 = nt;
            } else {
                new C1514vt();
                List list2 = Collections.EMPTY_LIST;
                AbstractC0577dp abstractC0577dp = C1481vB.l;
                Lt lt = Lt.a;
                C0934kk c0934kkA = nt.e.a();
                String str3 = nt.a;
                Rt rt = nt.d;
                nt.c.a();
                Lt lt2 = nt.f;
                Kt kt2 = nt.b;
                if (kt2 != null) {
                    String str4 = kt2.b;
                    Uri uri2 = kt2.a;
                    List list3 = kt2.c;
                    abstractC0577dp = kt2.d;
                    new C1514vt();
                    str = str4;
                    uri = uri2;
                    list = list3;
                    j = kt2.e;
                } else {
                    uri = null;
                    str = null;
                    list = list2;
                    j = -9223372036854775807L;
                }
                AbstractC0577dp abstractC0577dp2 = abstractC0577dp;
                It itA2 = jt2.a();
                Kt kt3 = uri != null ? new Kt(uri, str, null, list, abstractC0577dp2, j) : null;
                if (str3 == null) {
                    str3 = "";
                }
                String str5 = str3;
                Ht ht = new Ht(c0934kkA);
                Jt jt3 = new Jt(itA2);
                if (rt == null) {
                    rt = Rt.C;
                }
                nt2 = new Nt(str5, ht, kt3, jt3, rt, lt2);
            }
            Y5 y5D = interfaceC0428auB.d(nt2);
            AbstractC0577dp abstractC0577dp3 = nt2.b.d;
            if (!abstractC0577dp3.isEmpty()) {
                Y5[] y5Arr = new Y5[abstractC0577dp3.size() + 1];
                y5Arr[0] = y5D;
                if (abstractC0577dp3.size() > 0) {
                    if (!this.i) {
                        this.b.getClass();
                        Mt mt = (Mt) abstractC0577dp3.get(0);
                        new ArrayList(1);
                        new HashSet(1);
                        new CopyOnWriteArrayList();
                        new CopyOnWriteArrayList();
                        C0475bp c0475bp = AbstractC0577dp.i;
                        C1481vB c1481vB = C1481vB.l;
                        List list4 = Collections.EMPTY_LIST;
                        C1481vB c1481vB2 = C1481vB.l;
                        Lt lt3 = Lt.a;
                        Uri uri3 = Uri.EMPTY;
                        mt.getClass();
                        throw null;
                    }
                    C0130Ik c0130Ik = new C0130Ik();
                    ((Mt) abstractC0577dp3.get(0)).getClass();
                    ArrayList arrayList = AbstractC0739gv.a;
                    c0130Ik.o = null;
                    ((Mt) abstractC0577dp3.get(0)).getClass();
                    c0130Ik.d = null;
                    ((Mt) abstractC0577dp3.get(0)).getClass();
                    c0130Ik.e = 0;
                    ((Mt) abstractC0577dp3.get(0)).getClass();
                    c0130Ik.f = 0;
                    ((Mt) abstractC0577dp3.get(0)).getClass();
                    c0130Ik.b = null;
                    ((Mt) abstractC0577dp3.get(0)).getClass();
                    c0130Ik.a = null;
                    C0145Jk c0145Jk = new C0145Jk(c0130Ik);
                    if (this.c.D(c0145Jk)) {
                        C0130Ik c0130IkA = c0145Jk.a();
                        c0130IkA.o = AbstractC0739gv.p("application/x-media3-cues");
                        c0130IkA.k = c0145Jk.p;
                        c0130IkA.P = this.c.n(c0145Jk);
                        new C0145Jk(c0130IkA);
                    }
                    ((Mt) abstractC0577dp3.get(0)).getClass();
                    throw null;
                }
                y5D = new Xu(y5Arr);
            }
            if (nt2.e.a != Long.MIN_VALUE) {
                C0439b4 c0439b4 = new C0439b4();
                y5D.getClass();
                c0439b4.i = y5D;
                c0439b4.j = new C0934kk();
                Ht ht2 = nt2.e;
                QK.z(!c0439b4.h);
                c0439b4.j = ht2.a();
                QK.z(!c0439b4.h);
                c0439b4.h = true;
                y5D = new C0666fa(c0439b4);
            }
            nt2.b.getClass();
            nt2.b.getClass();
            return y5D;
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException(e);
        }
    }

    @Override // x.InterfaceC0428au
    public final InterfaceC0428au e(int i) {
        C0568df c0568df = this.a;
        c0568df.g = i;
        C0019Be c0019Be = c0568df.a;
        synchronized (c0019Be) {
            c0019Be.d = i;
        }
        return this;
    }

    @Override // x.InterfaceC0428au
    public final InterfaceC0428au f(C0300Uc c0300Uc) {
        this.c = c0300Uc;
        C0568df c0568df = this.a;
        c0568df.f = c0300Uc;
        C0019Be c0019Be = c0568df.a;
        synchronized (c0019Be) {
            c0019Be.c = c0300Uc;
        }
        Iterator it = c0568df.c.values().iterator();
        while (it.hasNext()) {
            ((InterfaceC0428au) it.next()).f(c0300Uc);
        }
        return this;
    }

    public final void h(InterfaceC0360Yg interfaceC0360Yg) {
        QK.t(interfaceC0360Yg, "MediaSource.Factory#setDrmSessionManagerProvider no longer handles null by instantiating a new DefaultDrmSessionManagerProvider. Explicitly construct and pass an instance in order to retain the old behavior.");
        C0568df c0568df = this.a;
        c0568df.i = interfaceC0360Yg;
        Iterator it = c0568df.c.values().iterator();
        while (it.hasNext()) {
            ((InterfaceC0428au) it.next()).c(interfaceC0360Yg);
        }
    }

    public final void i(C1725zw c1725zw) {
        QK.t(c1725zw, "MediaSource.Factory#setLoadErrorHandlingPolicy no longer handles null by instantiating a new DefaultLoadErrorHandlingPolicy. Explicitly construct and pass an instance in order to retain the old behavior.");
        C0568df c0568df = this.a;
        c0568df.j = c1725zw;
        Iterator it = c0568df.c.values().iterator();
        while (it.hasNext()) {
            ((InterfaceC0428au) it.next()).b(c1725zw);
        }
    }

    public C0619ef(InterfaceC1342sd interfaceC1342sd, C0019Be c0019Be) {
        C0300Uc c0300Uc = new C0300Uc(5);
        this.b = interfaceC1342sd;
        this.c = c0300Uc;
        C0568df c0568df = new C0568df(c0019Be, c0300Uc);
        this.a = c0568df;
        if (interfaceC1342sd != c0568df.d) {
            c0568df.d = interfaceC1342sd;
            c0568df.b.clear();
            c0568df.c.clear();
        }
        this.d = -9223372036854775807L;
        this.e = -9223372036854775807L;
        this.f = -9223372036854775807L;
        this.g = -3.4028235E38f;
        this.h = -3.4028235E38f;
        this.i = true;
    }
}
