package x;

import android.R;
import android.animation.Animator;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.content.res.XmlResourceParser;
import android.graphics.Bitmap;
import android.graphics.BitmapShader;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Shader;
import android.graphics.drawable.AnimationDrawable;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.ClipDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LayerDrawable;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RoundRectShape;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.MediaCodec;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.method.KeyListener;
import android.text.method.NumberKeyListener;
import android.util.AttributeSet;
import android.util.Log;
import android.util.SparseArray;
import android.util.Xml;
import android.view.ActionMode;
import android.view.Menu;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.widget.AbsSeekBar;
import android.widget.EditText;
import android.widget.ImageView;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.WeakHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import org.xmlpull.v1.XmlPullParserException;

/* loaded from: classes.dex */
public class I2 implements InterfaceC1342sd, InterfaceC0907k8, InterfaceC0247Qh, InterfaceC1300rn, InterfaceC1362sx {
    public static final int[] k = {R.attr.indeterminateDrawable, R.attr.progressDrawable};
    public final /* synthetic */ int h;
    public Object i;
    public Object j;

    public /* synthetic */ I2(int i, Object obj) {
        this.h = i;
        this.i = obj;
    }

    public static void c(I2 i2, C0822ia c0822ia) {
        i2.getClass();
        for (Map.Entry entry : new HashMap((HashMap) i2.i).entrySet()) {
            if (entry.getKey() != null) {
                throw new ClassCastException();
            }
            List list = (List) entry.getValue();
            if (!f(c0822ia, list).equals(f((C0822ia) i2.j, list))) {
                throw null;
            }
        }
        i2.j = c0822ia;
    }

    public static C0822ia f(C0822ia c0822ia, List list) {
        c0822ia.getClass();
        Map map = c0822ia.a;
        HashMap map2 = new HashMap(map);
        HashSet hashSet = new HashSet(list);
        for (String str : map.keySet()) {
            if (!hashSet.contains(str)) {
                map2.remove(str);
            }
        }
        return new C0822ia(map2);
    }

    public static Hq i(C0239Po c0239Po) {
        Vo vo = c0239Po.c;
        Object context = vo instanceof Vo ? vo.i.getContext() : c0239Po.a;
        while (!(context instanceof Fq)) {
            if (!(context instanceof ContextWrapper)) {
                return null;
            }
            context = ((ContextWrapper) context).getBaseContext();
        }
        return ((Fq) context).e();
    }

    public static boolean m(C0239Po c0239Po, Bitmap.Config config) {
        if (!QK.V(config)) {
            return true;
        }
        if (!((Boolean) AbstractC0431ax.u(c0239Po, So.f)).booleanValue()) {
            return false;
        }
        Vo vo = c0239Po.c;
        if (!(vo instanceof Vo)) {
            return true;
        }
        ImageView imageView = vo.i;
        return !imageView.isAttachedToWindow() || imageView.isHardwareAccelerated();
    }

    public WJ A(int i) {
        int i2 = 0;
        while (true) {
            int[] iArr = (int[]) this.i;
            if (i2 >= iArr.length) {
                AbstractC1578x4.t("BaseMediaChunkOutput", "Unmatched track of type: " + i);
                return new C1293rg();
            }
            if (i == iArr[i2]) {
                return ((VD[]) this.j)[i2];
            }
            i2++;
        }
    }

    @Override // x.InterfaceC1300rn
    public InterfaceC1362sx B() {
        return new I2(((InterfaceC1300rn) this.i).B(), (List) this.j, 27, false);
    }

    public void C() {
        Integer num;
        C0255Ra c0255Ra = (C0255Ra) this.j;
        String str = (String) this.i;
        Bundle bundle = c0255Ra.g;
        HashMap map = c0255Ra.f;
        if (!c0255Ra.d.contains(str) && (num = (Integer) c0255Ra.b.remove(str)) != null) {
            c0255Ra.a.remove(num);
        }
        c0255Ra.e.remove(str);
        if (map.containsKey(str)) {
            Log.w("ActivityResultRegistry", "Dropping pending result for request " + str + ": " + map.get(str));
            map.remove(str);
        }
        if (bundle.containsKey(str)) {
            Log.w("ActivityResultRegistry", "Dropping pending result for request " + str + ": " + bundle.getParcelable(str));
            bundle.remove(str);
        }
        if (c0255Ra.c.get(str) != null) {
            throw new ClassCastException();
        }
    }

    public C0534cx D(C0534cx c0534cx) {
        C0129Ij c0129Ij;
        boolean z;
        C0129Ij c0129Ij2 = c0534cx.j;
        C0745h0 c0745h0 = So.b;
        if (!QK.V((Bitmap.Config) AbstractC0431ax.v(c0534cx, c0745h0)) || ((InterfaceC0102Gm) this.j).l()) {
            c0129Ij = c0129Ij2;
            z = false;
        } else {
            c0129Ij2.getClass();
            LinkedHashMap linkedHashMapP = AbstractC1357ss.P(c0129Ij2.a);
            Bitmap.Config config = Bitmap.Config.ARGB_8888;
            if (config != null) {
                linkedHashMapP.put(c0745h0, config);
            } else {
                linkedHashMapP.remove(c0745h0);
            }
            C0129Ij c0129Ij3 = new C0129Ij(Jp.d0(linkedHashMapP));
            z = true;
            c0129Ij = c0129Ij3;
        }
        return z ? new C0534cx(c0534cx.a, c0534cx.b, c0534cx.c, c0534cx.d, c0534cx.e, c0534cx.f, c0534cx.g, c0534cx.h, c0534cx.i, c0129Ij) : c0534cx;
    }

    public void E(ArrayList arrayList) {
        Dw dw;
        for (int i = 0; i < arrayList.size(); i++) {
            if (((Cw) arrayList.get(i)).a == 1) {
                try {
                    dw = new Dw((Cw) arrayList.get(i));
                } catch (Bw unused) {
                    dw = null;
                }
                this.j = dw;
            }
        }
    }

    @Override // x.InterfaceC1362sx
    public Object I(Uri uri, C1550wd c1550wd) {
        InterfaceC0521ck interfaceC0521ck = (InterfaceC0521ck) ((InterfaceC1362sx) this.i).I(uri, c1550wd);
        List list = (List) this.j;
        return (list == null || list.isEmpty()) ? interfaceC0521ck : (InterfaceC0521ck) interfaceC0521ck.a(list);
    }

    @Override // x.InterfaceC0247Qh
    public Object a() {
        return (C0972lL) this.i;
    }

    @Override // x.InterfaceC0247Qh
    public boolean b(CharSequence charSequence, int i, int i2, XK xk) {
        if ((xk.c & 4) > 0) {
            return true;
        }
        if (((C0972lL) this.i) == null) {
            this.i = new C0972lL(charSequence instanceof Spannable ? (Spannable) charSequence : new SpannableString(charSequence));
        }
        ((C0300Uc) this.j).getClass();
        ((C0972lL) this.i).setSpan(new YK(xk), i, i2, 33);
        return true;
    }

    public void d() {
        this.i = null;
        this.j = null;
    }

    @Override // x.InterfaceC1342sd
    public InterfaceC1446ud e() {
        return new C1084ne((Context) this.i, ((C0139Je) this.j).e());
    }

    public AbstractC0389a6[] g(Handler handler, SurfaceHolderCallbackC0881jj surfaceHolderCallbackC0881jj, SurfaceHolderCallbackC0881jj surfaceHolderCallbackC0881jj2, SurfaceHolderCallbackC0881jj surfaceHolderCallbackC0881jj3, SurfaceHolderCallbackC0881jj surfaceHolderCallbackC0881jj4) {
        ArrayList arrayList = new ArrayList();
        W1 w1 = (W1) this.i;
        At at = new At(w1);
        E6 e6 = (E6) this.j;
        at.c = e6;
        at.d = 5000L;
        at.e = handler;
        at.f = surfaceHolderCallbackC0881jj;
        at.g = 50;
        QK.z(!at.b);
        Handler handler2 = at.e;
        QK.z((handler2 == null && at.f == null) || !(handler2 == null || at.f == null));
        at.b = true;
        arrayList.add(new Ct(at));
        C0515ce c0515ce = new C0515ce(w1);
        QK.z(!c0515ce.a);
        c0515ce.a = true;
        if (((C1467uy) c0515ce.c) == null) {
            c0515ce.c = new C1467uy(new O4[0]);
        }
        if (((C0956l5) c0515ce.e) == null) {
            if (((I2) c0515ce.f) == null) {
                c0515ce.f = new I2((Context) w1, 15);
            }
            if (((C1554wh) c0515ce.d) == null) {
                c0515ce.d = C1554wh.m;
            }
            C0904k5 c0904k5 = new C0904k5(w1);
            Context context = c0904k5.a;
            if (context == null) {
                c0904k5.d = null;
            }
            I2 i2 = (I2) c0515ce.f;
            c0904k5.b = i2;
            c0904k5.c = (C1554wh) c0515ce.d;
            if (i2 == null) {
                c0904k5.b = new I2(context, 15);
            }
            c0515ce.e = new C0956l5(c0904k5);
        } else {
            QK.z(((I2) c0515ce.f) == null);
            QK.z(((C1554wh) c0515ce.d) == null);
        }
        arrayList.add(new C0943kt(w1, e6, handler, surfaceHolderCallbackC0881jj2, new C0722ge(c0515ce)));
        arrayList.add(new VI(surfaceHolderCallbackC0881jj3, handler.getLooper()));
        Looper looper = handler.getLooper();
        for (int i = 0; i < 4; i++) {
            arrayList.add(new C0635ev(surfaceHolderCallbackC0881jj4, looper));
        }
        arrayList.add(new C0597e8());
        arrayList.add(new C0179Lo(new E6(w1)));
        return (AbstractC0389a6[]) arrayList.toArray(new AbstractC0389a6[0]);
    }

    public byte[] h(C0023Bi c0023Bi) throws IOException {
        DataOutputStream dataOutputStream = (DataOutputStream) this.j;
        ByteArrayOutputStream byteArrayOutputStream = (ByteArrayOutputStream) this.i;
        byteArrayOutputStream.reset();
        try {
            dataOutputStream.writeBytes(c0023Bi.a);
            dataOutputStream.writeByte(0);
            dataOutputStream.writeBytes(c0023Bi.b);
            dataOutputStream.writeByte(0);
            dataOutputStream.writeLong(c0023Bi.c);
            dataOutputStream.writeLong(c0023Bi.d);
            dataOutputStream.write(c0023Bi.e);
            dataOutputStream.flush();
            return byteArrayOutputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public C1682z4 j(C0145Jk c0145Jk, C0749h4 c0749h4) {
        boolean zBooleanValue;
        c0145Jk.getClass();
        int i = c0145Jk.L;
        c0749h4.getClass();
        int i2 = Build.VERSION.SDK_INT;
        if (i2 < 29 || i == -1) {
            return C1682z4.d;
        }
        Context context = (Context) this.i;
        Boolean bool = (Boolean) this.j;
        if (bool != null) {
            zBooleanValue = bool.booleanValue();
        } else {
            if (context != null) {
                String parameters = AbstractC1578x4.A(context).getParameters("offloadVariableRateSupported");
                this.j = Boolean.valueOf(parameters != null && parameters.equals("offloadVariableRateSupported=1"));
            } else {
                this.j = Boolean.FALSE;
            }
            zBooleanValue = ((Boolean) this.j).booleanValue();
        }
        String str = c0145Jk.p;
        str.getClass();
        int iD = AbstractC0739gv.d(str, c0145Jk.l);
        if (iD == 0 || i2 < AbstractC1595xL.p(iD)) {
            return C1682z4.d;
        }
        int iQ = c0145Jk.K;
        if (iQ == -1) {
            iQ = AbstractC1595xL.q(c0145Jk.J);
        }
        if (iQ == 0) {
            return C1682z4.d;
        }
        try {
            AudioFormat audioFormatBuild = new AudioFormat.Builder().setSampleRate(i).setChannelMask(iQ).setEncoding(iD).build();
            if (i2 >= 33) {
                int directPlaybackSupport = AudioManager.getDirectPlaybackSupport(audioFormatBuild, c0749h4.a());
                if ((directPlaybackSupport & 1) == 0) {
                    return C1682z4.d;
                }
                z = (directPlaybackSupport & 3) == 3;
                C1630y4 c1630y4 = new C1630y4();
                c1630y4.a = true;
                c1630y4.b = z;
                c1630y4.c = zBooleanValue;
                return c1630y4.a();
            }
            if (i2 < 31) {
                if (!AudioManager.isOffloadedPlaybackSupported(audioFormatBuild, c0749h4.a())) {
                    return C1682z4.d;
                }
                C1630y4 c1630y42 = new C1630y4();
                c1630y42.a = true;
                c1630y42.c = zBooleanValue;
                return c1630y42.a();
            }
            int playbackOffloadSupport = AudioManager.getPlaybackOffloadSupport(audioFormatBuild, c0749h4.a());
            if (playbackOffloadSupport == 0) {
                return C1682z4.d;
            }
            C1630y4 c1630y43 = new C1630y4();
            if (i2 > 32 && playbackOffloadSupport == 2) {
                z = true;
            }
            c1630y43.a = true;
            c1630y43.b = z;
            c1630y43.c = zBooleanValue;
            return c1630y43.a();
        } catch (IllegalArgumentException unused) {
            return C1682z4.d;
        }
    }

    public InterfaceC0054Dj k(Object... objArr) {
        Constructor constructorE;
        synchronized (((AtomicBoolean) this.j)) {
            if (!((AtomicBoolean) this.j).get()) {
                try {
                    constructorE = ((C0343Xd) this.i).e();
                } catch (ClassNotFoundException unused) {
                    ((AtomicBoolean) this.j).set(true);
                } catch (Exception e) {
                    throw new RuntimeException("Error instantiating extension", e);
                }
            }
            constructorE = null;
        }
        if (constructorE == null) {
            return null;
        }
        try {
            return (InterfaceC0054Dj) constructorE.newInstance(objArr);
        } catch (Exception e2) {
            throw new IllegalStateException("Unexpected error creating extractor", e2);
        }
    }

    public KeyListener l(KeyListener keyListener) {
        if (keyListener instanceof NumberKeyListener) {
            return keyListener;
        }
        ((I2) ((C0951l0) this.j).i).getClass();
        if (keyListener instanceof C0232Ph) {
            return keyListener;
        }
        if (keyListener == null) {
            return null;
        }
        return keyListener instanceof NumberKeyListener ? keyListener : new C0232Ph(keyListener);
    }

    public void n(AttributeSet attributeSet, int i) {
        switch (this.h) {
            case 0:
                AbsSeekBar absSeekBar = (AbsSeekBar) this.i;
                C1467uy c1467uyG = C1467uy.G(absSeekBar.getContext(), attributeSet, k, i);
                Drawable drawableU = c1467uyG.u(0);
                if (drawableU != null) {
                    if (drawableU instanceof AnimationDrawable) {
                        AnimationDrawable animationDrawable = (AnimationDrawable) drawableU;
                        int numberOfFrames = animationDrawable.getNumberOfFrames();
                        AnimationDrawable animationDrawable2 = new AnimationDrawable();
                        animationDrawable2.setOneShot(animationDrawable.isOneShot());
                        for (int i2 = 0; i2 < numberOfFrames; i2++) {
                            Drawable drawableZ = z(animationDrawable.getFrame(i2), true);
                            drawableZ.setLevel(10000);
                            animationDrawable2.addFrame(drawableZ, animationDrawable.getDuration(i2));
                        }
                        animationDrawable2.setLevel(10000);
                        drawableU = animationDrawable2;
                    }
                    absSeekBar.setIndeterminateDrawable(drawableU);
                }
                Drawable drawableU2 = c1467uyG.u(1);
                if (drawableU2 != null) {
                    absSeekBar.setProgressDrawable(z(drawableU2, false));
                }
                c1467uyG.J();
                return;
            default:
                TypedArray typedArrayObtainStyledAttributes = ((EditText) this.i).getContext().obtainStyledAttributes(attributeSet, AbstractC0703gA.i, i, 0);
                try {
                    boolean z = typedArrayObtainStyledAttributes.hasValue(14) ? typedArrayObtainStyledAttributes.getBoolean(14, true) : true;
                    typedArrayObtainStyledAttributes.recycle();
                    x(z);
                    return;
                } catch (Throwable th) {
                    typedArrayObtainStyledAttributes.recycle();
                    throw th;
                }
        }
    }

    public C0187Mh o(InputConnection inputConnection, EditorInfo editorInfo) {
        C0951l0 c0951l0 = (C0951l0) this.j;
        if (inputConnection == null) {
            c0951l0.getClass();
            inputConnection = null;
        } else {
            I2 i2 = (I2) c0951l0.i;
            i2.getClass();
            if (!(inputConnection instanceof C0187Mh)) {
                inputConnection = new C0187Mh((EditText) i2.i, inputConnection, editorInfo);
            }
        }
        return (C0187Mh) inputConnection;
    }

    @Override // x.InterfaceC0907k8
    public void onCancel() {
        ((Animator) this.i).end();
        if (C0883jl.D(2)) {
            Objects.toString((EG) this.j);
        }
    }

    public void p(L0 l0) {
        S4 s4 = (S4) this.i;
        ((ActionMode.Callback) s4.h).onDestroyActionMode(s4.i(l0));
        LayoutInflaterFactory2C1628y2 layoutInflaterFactory2C1628y2 = (LayoutInflaterFactory2C1628y2) this.j;
        if (layoutInflaterFactory2C1628y2.D != null) {
            layoutInflaterFactory2C1628y2.s.getDecorView().removeCallbacks(layoutInflaterFactory2C1628y2.E);
        }
        if (layoutInflaterFactory2C1628y2.C != null) {
            TM tm = layoutInflaterFactory2C1628y2.F;
            if (tm != null) {
                tm.b();
            }
            TM tmA = EM.a(layoutInflaterFactory2C1628y2.C);
            tmA.a(0.0f);
            layoutInflaterFactory2C1628y2.F = tmA;
            tmA.d(new C1057n2(2, this));
        }
        layoutInflaterFactory2C1628y2.B = null;
        ViewGroup viewGroup = layoutInflaterFactory2C1628y2.H;
        WeakHashMap weakHashMap = EM.a;
        AbstractC1440uM.c(viewGroup);
        layoutInflaterFactory2C1628y2.H();
    }

    public boolean q(L0 l0, Menu menu) {
        ViewGroup viewGroup = ((LayoutInflaterFactory2C1628y2) this.j).H;
        WeakHashMap weakHashMap = EM.a;
        AbstractC1440uM.c(viewGroup);
        S4 s4 = (S4) this.i;
        ActionMode.Callback callback = (ActionMode.Callback) s4.h;
        C0815iI c0815iII = s4.i(l0);
        JF jf = (JF) s4.k;
        Menu su = (Menu) jf.get(menu);
        if (su == null) {
            su = new Su((Context) s4.i, (MenuC1671yu) menu);
            jf.put(menu, su);
        }
        return callback.onPrepareActionMode(c0815iII, su);
    }

    public void r(Exception exc, boolean z) {
        this.j = null;
        HashSet hashSet = (HashSet) this.i;
        AbstractC0577dp abstractC0577dpJ = AbstractC0577dp.j(hashSet);
        hashSet.clear();
        C0475bp c0475bpL = abstractC0577dpJ.listIterator(0);
        while (c0475bpL.hasNext()) {
            C1240qe c1240qe = (C1240qe) c0475bpL.next();
            c1240qe.getClass();
            c1240qe.k(exc, z ? 1 : 3);
        }
    }

    public void s(C0010Ak c0010Ak) {
        UB ub = (UB) this.j;
        C1540wI c1540wI = (C1540wI) this.i;
        int i = c0010Ak.b;
        if (i != 0) {
            ub.execute(new Z7(i, 0, c1540wI));
        } else {
            ub.execute(new RunnableC0626em(c1540wI, 5, c0010Ak.a));
        }
    }

    /*  JADX ERROR: JadxRuntimeException in pass: ModVisitor
        jadx.core.utils.exceptions.JadxRuntimeException: Can't remove SSA var: r1v0 x.cx, still in use, count: 3, list:
          (r1v0 x.cx) from 0x0086: MOVE (r18v0 x.cx) = (r1v0 x.cx) (LINE:135)
          (r1v0 x.cx) from 0x007b: MOVE (r18v3 x.cx) = (r1v0 x.cx) (LINE:124)
          (r1v0 x.cx) from 0x006c: MOVE (r18v5 x.cx) = (r1v0 x.cx) (LINE:109)
        	at jadx.core.utils.InsnRemover.removeSsaVar(InsnRemover.java:162)
        	at jadx.core.utils.InsnRemover.unbindResult(InsnRemover.java:127)
        	at jadx.core.utils.InsnRemover.unbindInsn(InsnRemover.java:91)
        	at jadx.core.utils.InsnRemover.addAndUnbind(InsnRemover.java:57)
        	at jadx.core.dex.visitors.ModVisitor.removeStep(ModVisitor.java:463)
        	at jadx.core.dex.visitors.ModVisitor.visit(ModVisitor.java:97)
        */
    public x.C0534cx t(x.C0239Po r20, x.VF r21) {
        /*
            Method dump skipped, instructions count: 254
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: x.I2.t(x.Po, x.VF):x.cx");
    }

    @Override // x.InterfaceC1300rn
    public InterfaceC1362sx u(C1093nn c1093nn, C0885jn c0885jn) {
        return new I2(((InterfaceC1300rn) this.i).u(c1093nn, c0885jn), (List) this.j, 27, false);
    }

    /* JADX WARN: Code restructure failed: missing block: B:116:0x01c1, code lost:
    
        continue;
     */
    /* JADX WARN: Failed to restore switch over string. Please report as a decompilation issue */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public void v(Context context, XmlResourceParser xmlResourceParser) throws XmlPullParserException, NumberFormatException, IOException {
        int eventType;
        C0151Kb c0151KbD;
        C0226Pb c0226Pb = new C0226Pb();
        int attributeCount = xmlResourceParser.getAttributeCount();
        for (int i = 0; i < attributeCount; i++) {
            if ("id".equals(xmlResourceParser.getAttributeName(i))) {
                String attributeValue = xmlResourceParser.getAttributeValue(i);
                int identifier = attributeValue.contains("/") ? context.getResources().getIdentifier(attributeValue.substring(attributeValue.indexOf(47) + 1), "id", context.getPackageName()) : -1;
                if (identifier == -1) {
                    if (attributeValue.length() > 1) {
                        identifier = Integer.parseInt(attributeValue.substring(1));
                    } else {
                        Log.e("ConstraintLayoutStates", "error in parsing id");
                    }
                }
                try {
                    eventType = xmlResourceParser.getEventType();
                    c0151KbD = null;
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (XmlPullParserException e2) {
                    e2.printStackTrace();
                }
                while (eventType != 1) {
                    if (eventType == 0) {
                        xmlResourceParser.getName();
                    } else if (eventType == 2) {
                        String name = xmlResourceParser.getName();
                        switch (name.hashCode()) {
                            case -2025855158:
                                if (name.equals("Layout")) {
                                    if (c0151KbD == null) {
                                        throw new RuntimeException("XML parser error must be within a Constraint " + xmlResourceParser.getLineNumber());
                                    }
                                    c0151KbD.d.a(context, Xml.asAttributeSet(xmlResourceParser));
                                    break;
                                } else {
                                    continue;
                                }
                            case -1984451626:
                                if (name.equals("Motion")) {
                                    if (c0151KbD == null) {
                                        throw new RuntimeException("XML parser error must be within a Constraint " + xmlResourceParser.getLineNumber());
                                    }
                                    c0151KbD.c.a(context, Xml.asAttributeSet(xmlResourceParser));
                                    break;
                                } else {
                                    continue;
                                }
                            case -1269513683:
                                if (name.equals("PropertySet")) {
                                    if (c0151KbD == null) {
                                        throw new RuntimeException("XML parser error must be within a Constraint " + xmlResourceParser.getLineNumber());
                                    }
                                    c0151KbD.b.a(context, Xml.asAttributeSet(xmlResourceParser));
                                    break;
                                } else {
                                    continue;
                                }
                            case -1238332596:
                                if (name.equals("Transform")) {
                                    if (c0151KbD == null) {
                                        throw new RuntimeException("XML parser error must be within a Constraint " + xmlResourceParser.getLineNumber());
                                    }
                                    c0151KbD.e.a(context, Xml.asAttributeSet(xmlResourceParser));
                                    break;
                                } else {
                                    continue;
                                }
                            case -71750448:
                                if (name.equals("Guideline")) {
                                    c0151KbD = C0226Pb.d(context, Xml.asAttributeSet(xmlResourceParser));
                                    c0151KbD.d.a = true;
                                    break;
                                } else {
                                    break;
                                }
                            case 1331510167:
                                if (name.equals("Barrier")) {
                                    c0151KbD = C0226Pb.d(context, Xml.asAttributeSet(xmlResourceParser));
                                    c0151KbD.d.c0 = 1;
                                    break;
                                } else {
                                    break;
                                }
                            case 1791837707:
                                if (name.equals("CustomAttribute")) {
                                    if (c0151KbD == null) {
                                        throw new RuntimeException("XML parser error must be within a Constraint " + xmlResourceParser.getLineNumber());
                                    }
                                    C0061Eb.a(context, xmlResourceParser, c0151KbD.f);
                                    break;
                                } else {
                                    continue;
                                }
                            case 1803088381:
                                if (name.equals("Constraint")) {
                                    c0151KbD = C0226Pb.d(context, Xml.asAttributeSet(xmlResourceParser));
                                    break;
                                } else {
                                    break;
                                }
                        }
                    } else if (eventType != 3) {
                        continue;
                    } else {
                        String name2 = xmlResourceParser.getName();
                        if ("ConstraintSet".equals(name2)) {
                            ((SparseArray) this.j).put(identifier, c0226Pb);
                            return;
                        } else if (name2.equalsIgnoreCase("Constraint")) {
                            c0226Pb.c.put(Integer.valueOf(c0151KbD.a), c0151KbD);
                            c0151KbD = null;
                        }
                    }
                    eventType = xmlResourceParser.next();
                }
                ((SparseArray) this.j).put(identifier, c0226Pb);
                return;
            }
        }
    }

    public void w(C1240qe c1240qe) {
        ((HashSet) this.i).add(c1240qe);
        if (((C1240qe) this.j) != null) {
            return;
        }
        this.j = c1240qe;
        C0320Vi c0320ViP = c1240qe.b.p();
        c1240qe.z = c0320ViP;
        HandlerC1136oe handlerC1136oe = c1240qe.s;
        String str = AbstractC1595xL.a;
        c0320ViP.getClass();
        handlerC1136oe.getClass();
        handlerC1136oe.obtainMessage(1, new C1188pe(C1512vr.h.getAndIncrement(), true, SystemClock.elapsedRealtime(), c0320ViP)).sendToTarget();
    }

    public void x(boolean z) {
        C0319Vh c0319Vh = (C0319Vh) ((I2) ((C0951l0) this.j).i).j;
        if (c0319Vh.j != z) {
            if (c0319Vh.i != null) {
                C0097Gh c0097GhA = C0097Gh.a();
                C0305Uh c0305Uh = c0319Vh.i;
                c0097GhA.getClass();
                AbstractC1578x4.i(c0305Uh, "initCallback cannot be null");
                ReentrantReadWriteLock reentrantReadWriteLock = c0097GhA.a;
                reentrantReadWriteLock.writeLock().lock();
                try {
                    c0097GhA.b.remove(c0305Uh);
                } finally {
                    reentrantReadWriteLock.writeLock().unlock();
                }
            }
            c0319Vh.j = z;
            if (z) {
                C0319Vh.a(c0319Vh.h, C0097Gh.a().b());
            }
        }
    }

    public void y(int i, int i2, int i3, int i4) {
        AbstractC1167p8 abstractC1167p8 = (AbstractC1167p8) this.j;
        abstractC1167p8.k.set(i, i2, i3, i4);
        Rect rect = abstractC1167p8.j;
        super/*android.widget.FrameLayout*/.setPadding(i + rect.left, i2 + rect.top, i3 + rect.right, i4 + rect.bottom);
    }

    /* JADX WARN: Multi-variable type inference failed */
    public Drawable z(Drawable drawable, boolean z) {
        if (drawable instanceof FO) {
            ((GO) ((FO) drawable)).getClass();
        } else {
            if (drawable instanceof LayerDrawable) {
                LayerDrawable layerDrawable = (LayerDrawable) drawable;
                int numberOfLayers = layerDrawable.getNumberOfLayers();
                Drawable[] drawableArr = new Drawable[numberOfLayers];
                for (int i = 0; i < numberOfLayers; i++) {
                    int id = layerDrawable.getId(i);
                    drawableArr[i] = z(layerDrawable.getDrawable(i), id == 16908301 || id == 16908303);
                }
                LayerDrawable layerDrawable2 = new LayerDrawable(drawableArr);
                for (int i2 = 0; i2 < numberOfLayers; i2++) {
                    layerDrawable2.setId(i2, layerDrawable.getId(i2));
                    layerDrawable2.setLayerGravity(i2, layerDrawable.getLayerGravity(i2));
                    layerDrawable2.setLayerWidth(i2, layerDrawable.getLayerWidth(i2));
                    layerDrawable2.setLayerHeight(i2, layerDrawable.getLayerHeight(i2));
                    layerDrawable2.setLayerInsetLeft(i2, layerDrawable.getLayerInsetLeft(i2));
                    layerDrawable2.setLayerInsetRight(i2, layerDrawable.getLayerInsetRight(i2));
                    layerDrawable2.setLayerInsetTop(i2, layerDrawable.getLayerInsetTop(i2));
                    layerDrawable2.setLayerInsetBottom(i2, layerDrawable.getLayerInsetBottom(i2));
                    layerDrawable2.setLayerInsetStart(i2, layerDrawable.getLayerInsetStart(i2));
                    layerDrawable2.setLayerInsetEnd(i2, layerDrawable.getLayerInsetEnd(i2));
                }
                return layerDrawable2;
            }
            if (drawable instanceof BitmapDrawable) {
                BitmapDrawable bitmapDrawable = (BitmapDrawable) drawable;
                Bitmap bitmap = bitmapDrawable.getBitmap();
                if (((Bitmap) this.j) == null) {
                    this.j = bitmap;
                }
                ShapeDrawable shapeDrawable = new ShapeDrawable(new RoundRectShape(new float[]{5.0f, 5.0f, 5.0f, 5.0f, 5.0f, 5.0f, 5.0f, 5.0f}, null, null));
                shapeDrawable.getPaint().setShader(new BitmapShader(bitmap, Shader.TileMode.REPEAT, Shader.TileMode.CLAMP));
                shapeDrawable.getPaint().setColorFilter(bitmapDrawable.getPaint().getColorFilter());
                return z ? new ClipDrawable(shapeDrawable, 3, 1) : shapeDrawable;
            }
        }
        return drawable;
    }

    public /* synthetic */ I2(int i, Object obj, boolean z) {
        this.h = i;
        this.j = obj;
    }

    public /* synthetic */ I2(int i, boolean z) {
        this.h = i;
    }

    public /* synthetic */ I2(Object obj, int i, Object obj2) {
        this.h = i;
        this.j = obj;
        this.i = obj2;
    }

    public /* synthetic */ I2(Object obj, Object obj2, int i, boolean z) {
        this.h = i;
        this.i = obj;
        this.j = obj2;
    }

    public I2(CA ca) {
        Object c0991lp;
        this.h = 2;
        this.i = ca;
        int i = Build.VERSION.SDK_INT;
        int i2 = 1;
        char c = 1;
        char c2 = 1;
        if (i < 26) {
            boolean z = AbstractC0117Hm.a;
        } else {
            if (!AbstractC0117Hm.a) {
                if (i != 26 && i != 27) {
                    c0991lp = new C0991lp(i2, (boolean) (c2 == true ? 1 : 0));
                } else {
                    c0991lp = new C0300Uc(25);
                }
            }
            this.j = c0991lp;
        }
        c0991lp = new C0991lp((int) (c == true ? 1 : 0), false);
        this.j = c0991lp;
    }

    public I2(EditText editText, int i) {
        this.h = i;
        switch (i) {
            case 22:
                this.i = editText;
                C0319Vh c0319Vh = new C0319Vh(editText);
                this.j = c0319Vh;
                editText.addTextChangedListener(c0319Vh);
                if (C0157Kh.b == null) {
                    synchronized (C0157Kh.a) {
                        try {
                            if (C0157Kh.b == null) {
                                C0157Kh c0157Kh = new C0157Kh();
                                try {
                                    C0157Kh.c = Class.forName("android.text.DynamicLayout$ChangeWatcher", false, C0157Kh.class.getClassLoader());
                                } catch (Throwable unused) {
                                }
                                C0157Kh.b = c0157Kh;
                            }
                        } finally {
                        }
                    }
                }
                editText.setEditableFactory(C0157Kh.b);
                return;
            default:
                this.i = editText;
                this.j = new C0951l0(editText);
                return;
        }
    }

    public I2(int i) {
        this.h = i;
        switch (i) {
            case 17:
                this.i = new HashSet();
                break;
            case 24:
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(512);
                this.i = byteArrayOutputStream;
                this.j = new DataOutputStream(byteArrayOutputStream);
                break;
            case 25:
                this.i = new HashMap();
                this.j = C0822ia.b;
                break;
            default:
                this.i = ByteBuffer.allocateDirect(500);
                break;
        }
    }

    public I2(Context context, int i) throws Resources.NotFoundException {
        this.h = i;
        switch (i) {
            case 15:
                this.i = context == null ? null : context.getApplicationContext();
                break;
            default:
                TypedArray typedArrayObtainStyledAttributes = context.obtainStyledAttributes(AbstractC1070nF.d0(context, com.cochi.client.R.attr.materialCalendarStyle, Js.class.getCanonicalName()).data, AbstractC0651fA.m);
                C1554wh.i(context, typedArrayObtainStyledAttributes.getResourceId(4, 0));
                C1554wh.i(context, typedArrayObtainStyledAttributes.getResourceId(2, 0));
                C1554wh.i(context, typedArrayObtainStyledAttributes.getResourceId(3, 0));
                C1554wh.i(context, typedArrayObtainStyledAttributes.getResourceId(5, 0));
                ColorStateList colorStateListB = AbstractC1578x4.B(context, typedArrayObtainStyledAttributes, 7);
                this.i = C1554wh.i(context, typedArrayObtainStyledAttributes.getResourceId(9, 0));
                C1554wh.i(context, typedArrayObtainStyledAttributes.getResourceId(8, 0));
                this.j = C1554wh.i(context, typedArrayObtainStyledAttributes.getResourceId(10, 0));
                new Paint().setColor(colorStateListB.getDefaultColor());
                typedArrayObtainStyledAttributes.recycle();
                break;
        }
    }

    public I2(W1 w1, int i) {
        this.h = i;
        switch (i) {
            case 19:
                this.i = w1;
                this.j = new E6(w1);
                break;
            default:
                C0139Je c0139Je = new C0139Je(0);
                this.i = w1.getApplicationContext();
                this.j = c0139Je;
                break;
        }
    }

    public I2(MediaCodec.CryptoInfo cryptoInfo) {
        this.h = 14;
        this.i = cryptoInfo;
        this.j = W.d();
    }

    public I2(C0343Xd c0343Xd) {
        this.h = 18;
        this.i = c0343Xd;
        this.j = new AtomicBoolean(false);
    }
}
