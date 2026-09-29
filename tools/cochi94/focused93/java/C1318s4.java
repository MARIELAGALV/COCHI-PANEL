package x;

import android.content.Context;

/* renamed from: x.s4, reason: case insensitive filesystem */
/* loaded from: classes.dex */
public final /* synthetic */ class C1318s4 implements InterfaceC0659fI {
    public final /* synthetic */ int h;
    public final /* synthetic */ Object i;

    public /* synthetic */ C1318s4(int i, Object obj) {
        this.h = i;
        this.i = obj;
    }

    @Override // x.InterfaceC0659fI
    public final Object get() {
        switch (this.h) {
            case 0:
                return AbstractC1578x4.A((Context) this.i);
            case 1:
                try {
                    return (InterfaceC0428au) ((Class) this.i).getConstructor(null).newInstance(null);
                } catch (Exception e) {
                    throw new IllegalStateException(e);
                }
            case 2:
                return (C0413af) this.i;
            default:
                return (C0619ef) this.i;
        }
    }
}
