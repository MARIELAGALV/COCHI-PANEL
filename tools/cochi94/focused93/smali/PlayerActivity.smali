.class public Lcom/cochi/client/PlayerActivity;
.super Lx/W1;
.source "SourceFile"


# static fields
.field public static final z0:[J


# instance fields
.field public E:Lx/nj;

.field public F:Landroidx/media3/ui/PlayerView;

.field public G:Landroid/webkit/WebView;

.field public H:Landroid/widget/ProgressBar;

.field public I:Landroid/view/View;

.field public J:Landroid/widget/TextView;

.field public K:Landroid/widget/TextView;

.field public L:Landroid/view/View;

.field public M:Lcom/google/android/material/button/MaterialButton;

.field public N:Lcom/google/android/material/button/MaterialButton;

.field public O:Lcom/google/android/material/button/MaterialButton;

.field public P:Landroid/view/View;

.field public Q:Landroid/widget/ImageButton;

.field public R:Landroid/widget/ImageButton;

.field public S:Landroid/widget/ImageButton;

.field public T:Lx/hF;

.field public final U:Landroid/os/Handler;

.field public final V:Lx/dy;

.field public final W:Ljava/util/concurrent/ExecutorService;

.field public X:Z

.field public Y:Z

.field public Z:Lx/P8;

.field public a0:I

.field public b0:I

.field public c0:I

.field public d0:I

.field public e0:J

.field public f0:I

.field public g0:Lx/i9;

.field public h0:Lx/fy;

.field public i0:Lx/fy;

.field public j0:Z

.field public k0:Z

.field public l0:Z

.field public m0:Lx/u4;

.field public final n0:Lx/ry;

.field public o0:Z

.field public p0:Z

.field public q0:Z

.field public r0:Z

.field public volatile s0:Z

.field public t0:Z

.field public u0:Ljava/lang/Runnable;

.field public final v0:Lx/ry;

.field public final w0:Lx/ry;

.field public final x0:Lx/ry;

.field public final y0:Lx/ry;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .line 1
    const/4 v0, 0x4

    .line 2
    new-array v0, v0, [J

    .line 3
    .line 4
    fill-array-data v0, :array_0

    .line 5
    .line 6
    .line 7
    sput-object v0, Lcom/cochi/client/PlayerActivity;->z0:[J

    .line 8
    .line 9
    return-void

    .line 10
    nop

    .line 11
    :array_0
    .array-data 8
        0x12c
        0x2bc
        0x578
        0x9c4
    .end array-data
.end method

.method public constructor <init>()V
    .locals 4

    .line 1
    invoke-direct {p0}, Lx/W1;-><init>()V

    .line 2
    .line 3
    .line 4
    new-instance v0, Lx/hF;

    .line 5
    .line 6
    const/4 v1, 0x0

    .line 7
    const-wide/16 v2, -0x1

    .line 8
    .line 9
    invoke-direct {v0, v1, v1, v2, v3}, Lx/hF;-><init>(Lx/W6;Lx/W6;J)V

    .line 10
    .line 11
    .line 12
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->T:Lx/hF;

    .line 13
    .line 14
    new-instance v0, Landroid/os/Handler;

    .line 15
    .line 16
    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    .line 17
    .line 18
    .line 19
    move-result-object v1

    .line 20
    invoke-direct {v0, v1}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    .line 21
    .line 22
    .line 23
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 24
    .line 25
    new-instance v0, Lx/dy;

    .line 26
    .line 27
    const/4 v1, 0x0

    .line 28
    invoke-direct {v0, p0, v1}, Lx/dy;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 29
    .line 30
    .line 31
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->V:Lx/dy;

    .line 32
    .line 33
    invoke-static {}, Ljava/util/concurrent/Executors;->newSingleThreadExecutor()Ljava/util/concurrent/ExecutorService;

    .line 34
    .line 35
    .line 36
    move-result-object v0

    .line 37
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->W:Ljava/util/concurrent/ExecutorService;

    .line 38
    .line 39
    const/4 v0, 0x0

    .line 40
    iput v0, p0, Lcom/cochi/client/PlayerActivity;->a0:I

    .line 41
    .line 42
    iput v0, p0, Lcom/cochi/client/PlayerActivity;->b0:I

    .line 43
    .line 44
    const/4 v1, -0x1

    .line 45
    iput v1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 46
    .line 47
    iput v0, p0, Lcom/cochi/client/PlayerActivity;->d0:I

    .line 48
    .line 49
    const-wide/16 v1, 0x0

    .line 50
    .line 51
    iput-wide v1, p0, Lcom/cochi/client/PlayerActivity;->e0:J

    .line 52
    .line 53
    iput v0, p0, Lcom/cochi/client/PlayerActivity;->f0:I

    .line 54
    .line 55
    new-instance v0, Lx/ry;

    .line 56
    .line 57
    const/4 v1, 0x0

    .line 58
    invoke-direct {v0, p0, v1}, Lx/ry;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 59
    .line 60
    .line 61
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->n0:Lx/ry;

    .line 62
    .line 63
    new-instance v0, Lx/ry;

    .line 64
    .line 65
    const/4 v1, 0x1

    .line 66
    invoke-direct {v0, p0, v1}, Lx/ry;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 67
    .line 68
    .line 69
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->v0:Lx/ry;

    .line 70
    .line 71
    new-instance v0, Lx/ry;

    .line 72
    .line 73
    const/4 v1, 0x2

    .line 74
    invoke-direct {v0, p0, v1}, Lx/ry;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 75
    .line 76
    .line 77
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->w0:Lx/ry;

    .line 78
    .line 79
    new-instance v0, Lx/ry;

    .line 80
    .line 81
    const/4 v1, 0x3

    .line 82
    invoke-direct {v0, p0, v1}, Lx/ry;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 83
    .line 84
    .line 85
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->x0:Lx/ry;

    .line 86
    .line 87
    new-instance v0, Lx/ry;

    .line 88
    .line 89
    const/4 v1, 0x4

    .line 90
    invoke-direct {v0, p0, v1}, Lx/ry;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 91
    .line 92
    .line 93
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->y0:Lx/ry;

    .line 94
    .line 95
    return-void
.end method

.method public static C(Ljava/lang/String;)[B
    .locals 5

    .line 1
    const-string v0, "-"

    .line 2
    .line 3
    const-string v1, ""

    .line 4
    .line 5
    invoke-virtual {p0, v0, v1}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    .line 6
    .line 7
    .line 8
    move-result-object p0

    .line 9
    const-string v0, " "

    .line 10
    .line 11
    invoke-virtual {p0, v0, v1}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    .line 12
    .line 13
    .line 14
    move-result-object p0

    .line 15
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 16
    .line 17
    .line 18
    move-result-object p0

    .line 19
    invoke-static {p0}, Lcom/cochi/client/PlayerActivity;->G(Ljava/lang/String;)Z

    .line 20
    .line 21
    .line 22
    move-result v0

    .line 23
    if-eqz v0, :cond_1

    .line 24
    .line 25
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    .line 26
    .line 27
    .line 28
    move-result v0

    .line 29
    div-int/lit8 v0, v0, 0x2

    .line 30
    .line 31
    new-array v0, v0, [B

    .line 32
    .line 33
    const/4 v1, 0x0

    .line 34
    :goto_0
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    .line 35
    .line 36
    .line 37
    move-result v2

    .line 38
    if-ge v1, v2, :cond_0

    .line 39
    .line 40
    div-int/lit8 v2, v1, 0x2

    .line 41
    .line 42
    add-int/lit8 v3, v1, 0x2

    .line 43
    .line 44
    invoke-virtual {p0, v1, v3}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    .line 45
    .line 46
    .line 47
    move-result-object v1

    .line 48
    const/16 v4, 0x10

    .line 49
    .line 50
    invoke-static {v1, v4}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;I)I

    .line 51
    .line 52
    .line 53
    move-result v1

    .line 54
    int-to-byte v1, v1

    .line 55
    aput-byte v1, v0, v2

    .line 56
    .line 57
    move v1, v3

    .line 58
    goto :goto_0

    .line 59
    :cond_0
    return-object v0

    .line 60
    :cond_1
    new-instance p0, Ljava/lang/IllegalArgumentException;

    .line 61
    .line 62
    const-string v0, "KID/KEY inv\u00e1lido"

    .line 63
    .line 64
    invoke-direct {p0, v0}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    .line 65
    .line 66
    .line 67
    throw p0
.end method

.method public static G(Ljava/lang/String;)Z
    .locals 2

    .line 1
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    .line 2
    .line 3
    .line 4
    move-result v0

    .line 5
    const/16 v1, 0x20

    .line 6
    .line 7
    if-ne v0, v1, :cond_0

    .line 8
    .line 9
    const-string v0, "(?i)[0-9a-f]{32}"

    .line 10
    .line 11
    invoke-virtual {p0, v0}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    .line 12
    .line 13
    .line 14
    move-result p0

    .line 15
    if-eqz p0, :cond_0

    .line 16
    .line 17
    const/4 p0, 0x1

    .line 18
    return p0

    .line 19
    :cond_0
    const/4 p0, 0x0

    .line 20
    return p0
.end method

.method public static I(Ljava/lang/String;)Ljava/lang/String;
    .locals 9

    .line 1
    const-string v0, ""

    .line 2
    .line 3
    if-nez p0, :cond_0

    .line 4
    .line 5
    goto/16 :goto_3

    .line 6
    .line 7
    :cond_0
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 8
    .line 9
    .line 10
    move-result-object p0

    .line 11
    if-nez p0, :cond_1

    .line 12
    .line 13
    move-object v1, v0

    .line 14
    goto :goto_0

    .line 15
    :cond_1
    const-string v1, "-"

    .line 16
    .line 17
    invoke-virtual {p0, v1, v0}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    .line 18
    .line 19
    .line 20
    move-result-object v1

    .line 21
    const-string v2, " "

    .line 22
    .line 23
    invoke-virtual {v1, v2, v0}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    .line 24
    .line 25
    .line 26
    move-result-object v1

    .line 27
    invoke-virtual {v1}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 28
    .line 29
    .line 30
    move-result-object v1

    .line 31
    :goto_0
    invoke-static {v1}, Lcom/cochi/client/PlayerActivity;->G(Ljava/lang/String;)Z

    .line 32
    .line 33
    .line 34
    move-result v2

    .line 35
    if-eqz v2, :cond_2

    .line 36
    .line 37
    sget-object p0, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    .line 38
    .line 39
    invoke-virtual {v1, p0}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    .line 40
    .line 41
    .line 42
    move-result-object p0

    .line 43
    return-object p0

    .line 44
    :cond_2
    :try_start_0
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    .line 45
    .line 46
    .line 47
    move-result v1

    .line 48
    rem-int/lit8 v1, v1, 0x4

    .line 49
    .line 50
    if-eqz v1, :cond_3

    .line 51
    .line 52
    new-instance v2, Ljava/lang/StringBuilder;

    .line 53
    .line 54
    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    .line 55
    .line 56
    .line 57
    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 58
    .line 59
    .line 60
    const-string p0, "===="

    .line 61
    .line 62
    invoke-virtual {p0, v1}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    .line 63
    .line 64
    .line 65
    move-result-object p0

    .line 66
    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 67
    .line 68
    .line 69
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 70
    .line 71
    .line 72
    move-result-object p0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_1

    .line 73
    :cond_3
    const/4 v1, 0x2

    .line 74
    :try_start_1
    invoke-static {p0, v1}, Landroid/util/Base64;->decode(Ljava/lang/String;I)[B

    .line 75
    .line 76
    .line 77
    move-result-object p0
    :try_end_1
    .catch Ljava/lang/IllegalArgumentException; {:try_start_1 .. :try_end_1} :catch_0
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    .line 78
    goto :goto_1

    .line 79
    :catch_0
    const/16 v1, 0xa

    .line 80
    .line 81
    :try_start_2
    invoke-static {p0, v1}, Landroid/util/Base64;->decode(Ljava/lang/String;I)[B

    .line 82
    .line 83
    .line 84
    move-result-object p0

    .line 85
    :goto_1
    array-length v1, p0

    .line 86
    const/16 v2, 0x10

    .line 87
    .line 88
    if-eq v1, v2, :cond_4

    .line 89
    .line 90
    goto :goto_3

    .line 91
    :cond_4
    new-instance v1, Ljava/lang/StringBuilder;

    .line 92
    .line 93
    const/16 v2, 0x20

    .line 94
    .line 95
    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(I)V

    .line 96
    .line 97
    .line 98
    array-length v2, p0

    .line 99
    const/4 v3, 0x0

    .line 100
    move v4, v3

    .line 101
    :goto_2
    if-ge v4, v2, :cond_5

    .line 102
    .line 103
    aget-byte v5, p0, v4

    .line 104
    .line 105
    sget-object v6, Ljava/util/Locale;->US:Ljava/util/Locale;

    .line 106
    .line 107
    const-string v7, "%02x"

    .line 108
    .line 109
    and-int/lit16 v5, v5, 0xff

    .line 110
    .line 111
    invoke-static {v5}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 112
    .line 113
    .line 114
    move-result-object v5

    .line 115
    const/4 v8, 0x1

    .line 116
    new-array v8, v8, [Ljava/lang/Object;

    .line 117
    .line 118
    aput-object v5, v8, v3

    .line 119
    .line 120
    invoke-static {v6, v7, v8}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    .line 121
    .line 122
    .line 123
    move-result-object v5

    .line 124
    invoke-virtual {v1, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 125
    .line 126
    .line 127
    add-int/lit8 v4, v4, 0x1

    .line 128
    .line 129
    goto :goto_2

    .line 130
    :cond_5
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 131
    .line 132
    .line 133
    move-result-object p0
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_1

    .line 134
    return-object p0

    .line 135
    :catch_1
    :goto_3
    return-object v0
.end method

.method public static J(Ljava/lang/String;)Ljava/util/ArrayList;
    .locals 10

    .line 1
    if-nez p0, :cond_0

    .line 2
    .line 3
    const-string p0, ""

    .line 4
    .line 5
    goto :goto_0

    .line 6
    :cond_0
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 7
    .line 8
    .line 9
    move-result-object p0

    .line 10
    :goto_0
    invoke-virtual {p0}, Ljava/lang/String;->isEmpty()Z

    .line 11
    .line 12
    .line 13
    move-result v0

    .line 14
    const-string v1, "Faltan claves ClearKey"

    .line 15
    .line 16
    if-nez v0, :cond_a

    .line 17
    .line 18
    const-string v0, "[\\r\\n,;]+"

    .line 19
    .line 20
    invoke-virtual {p0, v0}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    .line 21
    .line 22
    .line 23
    move-result-object p0

    .line 24
    new-instance v0, Ljava/util/ArrayList;

    .line 25
    .line 26
    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    .line 27
    .line 28
    .line 29
    array-length v2, p0

    .line 30
    const/4 v3, 0x0

    .line 31
    move v4, v3

    .line 32
    :goto_1
    if-ge v4, v2, :cond_8

    .line 33
    .line 34
    aget-object v5, p0, v4

    .line 35
    .line 36
    invoke-virtual {v5}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 37
    .line 38
    .line 39
    move-result-object v5

    .line 40
    invoke-virtual {v5}, Ljava/lang/String;->isEmpty()Z

    .line 41
    .line 42
    .line 43
    move-result v6

    .line 44
    if-eqz v6, :cond_1

    .line 45
    .line 46
    goto :goto_5

    .line 47
    :cond_1
    const-string v6, "\\s*:\\s*"

    .line 48
    .line 49
    invoke-virtual {v5, v6}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    .line 50
    .line 51
    .line 52
    move-result-object v6

    .line 53
    array-length v7, v6

    .line 54
    const/4 v8, 0x2

    .line 55
    if-ge v7, v8, :cond_2

    .line 56
    .line 57
    const-string v6, "\\s*[|=]\\s*"

    .line 58
    .line 59
    invoke-virtual {v5, v6, v8}, Ljava/lang/String;->split(Ljava/lang/String;I)[Ljava/lang/String;

    .line 60
    .line 61
    .line 62
    move-result-object v6

    .line 63
    :cond_2
    array-length v5, v6

    .line 64
    if-lt v5, v8, :cond_7

    .line 65
    .line 66
    array-length v5, v6

    .line 67
    const/4 v7, 0x3

    .line 68
    const/4 v9, 0x1

    .line 69
    if-lt v5, v7, :cond_3

    .line 70
    .line 71
    aget-object v5, v6, v3

    .line 72
    .line 73
    invoke-virtual {v5}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 74
    .line 75
    .line 76
    move-result-object v5

    .line 77
    const-string v7, "max"

    .line 78
    .line 79
    invoke-virtual {v7, v5}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    .line 80
    .line 81
    .line 82
    move-result v5

    .line 83
    if-eqz v5, :cond_3

    .line 84
    .line 85
    move v5, v9

    .line 86
    goto :goto_2

    .line 87
    :cond_3
    move v5, v3

    .line 88
    :goto_2
    array-length v7, v6

    .line 89
    sub-int/2addr v7, v8

    .line 90
    aget-object v7, v6, v7

    .line 91
    .line 92
    invoke-static {v7}, Lcom/cochi/client/PlayerActivity;->I(Ljava/lang/String;)Ljava/lang/String;

    .line 93
    .line 94
    .line 95
    move-result-object v7

    .line 96
    array-length v8, v6

    .line 97
    sub-int/2addr v8, v9

    .line 98
    aget-object v6, v6, v8

    .line 99
    .line 100
    invoke-static {v6}, Lcom/cochi/client/PlayerActivity;->I(Ljava/lang/String;)Ljava/lang/String;

    .line 101
    .line 102
    .line 103
    move-result-object v6

    .line 104
    invoke-static {v7}, Lcom/cochi/client/PlayerActivity;->G(Ljava/lang/String;)Z

    .line 105
    .line 106
    .line 107
    move-result v8

    .line 108
    if-eqz v8, :cond_6

    .line 109
    .line 110
    invoke-static {v6}, Lcom/cochi/client/PlayerActivity;->G(Ljava/lang/String;)Z

    .line 111
    .line 112
    .line 113
    move-result v8

    .line 114
    if-eqz v8, :cond_6

    .line 115
    .line 116
    if-eqz v5, :cond_4

    .line 117
    .line 118
    move-object v8, v6

    .line 119
    goto :goto_3

    .line 120
    :cond_4
    move-object v8, v7

    .line 121
    :goto_3
    if-eqz v5, :cond_5

    .line 122
    .line 123
    goto :goto_4

    .line 124
    :cond_5
    move-object v7, v6

    .line 125
    :goto_4
    invoke-static {v0, v8, v7}, Lcom/cochi/client/PlayerActivity;->r(Ljava/util/ArrayList;Ljava/lang/String;Ljava/lang/String;)V

    .line 126
    .line 127
    .line 128
    :goto_5
    add-int/lit8 v4, v4, 0x1

    .line 129
    .line 130
    goto :goto_1

    .line 131
    :cond_6
    new-instance p0, Ljava/lang/IllegalArgumentException;

    .line 132
    .line 133
    const-string v0, "KID/KEY inv\u00e1lido"

    .line 134
    .line 135
    invoke-direct {p0, v0}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    .line 136
    .line 137
    .line 138
    throw p0

    .line 139
    :cond_7
    new-instance p0, Ljava/lang/IllegalArgumentException;

    .line 140
    .line 141
    const-string v0, "Formato ClearKey inv\u00e1lido"

    .line 142
    .line 143
    invoke-direct {p0, v0}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    .line 144
    .line 145
    .line 146
    throw p0

    .line 147
    :cond_8
    invoke-virtual {v0}, Ljava/util/ArrayList;->isEmpty()Z

    .line 148
    .line 149
    .line 150
    move-result p0

    .line 151
    if-nez p0, :cond_9

    .line 152
    .line 153
    return-object v0

    .line 154
    :cond_9
    new-instance p0, Ljava/lang/IllegalArgumentException;

    .line 155
    .line 156
    invoke-direct {p0, v1}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    .line 157
    .line 158
    .line 159
    throw p0

    .line 160
    :cond_a
    new-instance p0, Ljava/lang/IllegalArgumentException;

    .line 161
    .line 162
    invoke-direct {p0, v1}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    .line 163
    .line 164
    .line 165
    throw p0
.end method

.method public static r(Ljava/util/ArrayList;Ljava/lang/String;Ljava/lang/String;)V
    .locals 4

    .line 1
    invoke-virtual {p0}, Ljava/util/ArrayList;->size()I

    .line 2
    .line 3
    .line 4
    move-result v0

    .line 5
    const/4 v1, 0x0

    .line 6
    :cond_0
    if-ge v1, v0, :cond_1

    .line 7
    .line 8
    invoke-virtual {p0, v1}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    .line 9
    .line 10
    .line 11
    move-result-object v2

    .line 12
    add-int/lit8 v1, v1, 0x1

    .line 13
    .line 14
    check-cast v2, Lx/sy;

    .line 15
    .line 16
    iget-object v3, v2, Lx/sy;->a:Ljava/lang/String;

    .line 17
    .line 18
    invoke-virtual {v3, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    .line 19
    .line 20
    .line 21
    move-result v3

    .line 22
    if-eqz v3, :cond_0

    .line 23
    .line 24
    iget-object v2, v2, Lx/sy;->b:Ljava/lang/String;

    .line 25
    .line 26
    invoke-virtual {v2, p2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    .line 27
    .line 28
    .line 29
    move-result v2

    .line 30
    if-eqz v2, :cond_0

    .line 31
    .line 32
    return-void

    .line 33
    :cond_1
    new-instance v0, Lx/sy;

    .line 34
    .line 35
    invoke-direct {v0, p1, p2}, Lx/sy;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    .line 36
    .line 37
    .line 38
    invoke-virtual {p0, v0}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 39
    .line 40
    .line 41
    return-void
.end method

.method public static w(Ljava/util/ArrayList;)Ljava/lang/String;
    .locals 5

    .line 1
    new-instance v0, Ljava/lang/StringBuilder;

    .line 2
    .line 3
    const-string v1, "{\"keys\":["

    .line 4
    .line 5
    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 6
    .line 7
    .line 8
    const/4 v1, 0x0

    .line 9
    :goto_0
    invoke-virtual {p0}, Ljava/util/ArrayList;->size()I

    .line 10
    .line 11
    .line 12
    move-result v2

    .line 13
    if-ge v1, v2, :cond_1

    .line 14
    .line 15
    invoke-virtual {p0, v1}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    .line 16
    .line 17
    .line 18
    move-result-object v2

    .line 19
    check-cast v2, Lx/sy;

    .line 20
    .line 21
    if-lez v1, :cond_0

    .line 22
    .line 23
    const/16 v3, 0x2c

    .line 24
    .line 25
    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    .line 26
    .line 27
    .line 28
    :cond_0
    iget-object v3, v2, Lx/sy;->a:Ljava/lang/String;

    .line 29
    .line 30
    invoke-static {v3}, Lcom/cochi/client/PlayerActivity;->C(Ljava/lang/String;)[B

    .line 31
    .line 32
    .line 33
    move-result-object v3

    .line 34
    const/16 v4, 0xb

    .line 35
    .line 36
    invoke-static {v3, v4}, Landroid/util/Base64;->encodeToString([BI)Ljava/lang/String;

    .line 37
    .line 38
    .line 39
    move-result-object v3

    .line 40
    iget-object v2, v2, Lx/sy;->b:Ljava/lang/String;

    .line 41
    .line 42
    invoke-static {v2}, Lcom/cochi/client/PlayerActivity;->C(Ljava/lang/String;)[B

    .line 43
    .line 44
    .line 45
    move-result-object v2

    .line 46
    invoke-static {v2, v4}, Landroid/util/Base64;->encodeToString([BI)Ljava/lang/String;

    .line 47
    .line 48
    .line 49
    move-result-object v2

    .line 50
    const-string v4, "{\"kty\":\"oct\",\"kid\":\""

    .line 51
    .line 52
    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 53
    .line 54
    .line 55
    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 56
    .line 57
    .line 58
    const-string v3, "\",\"k\":\""

    .line 59
    .line 60
    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 61
    .line 62
    .line 63
    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 64
    .line 65
    .line 66
    const-string v2, "\"}"

    .line 67
    .line 68
    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 69
    .line 70
    .line 71
    add-int/lit8 v1, v1, 0x1

    .line 72
    .line 73
    goto :goto_0

    .line 74
    :cond_1
    const-string p0, "],\"type\":\"temporary\"}"

    .line 75
    .line 76
    invoke-virtual {v0, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 77
    .line 78
    .line 79
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 80
    .line 81
    .line 82
    move-result-object p0

    .line 83
    return-object p0
.end method

.method public static y(Lx/i9;Ljava/lang/String;)Lx/Nt;
    .locals 15

    .line 1
    new-instance v0, Lx/kk;

    .line 2
    .line 3
    invoke-direct {v0}, Lx/kk;-><init>()V

    .line 4
    .line 5
    .line 6
    new-instance v1, Lx/vt;

    .line 7
    .line 8
    invoke-direct {v1}, Lx/vt;-><init>()V

    .line 9
    .line 10
    .line 11
    sget-object v6, Ljava/util/Collections;->EMPTY_LIST:Ljava/util/List;

    .line 12
    .line 13
    sget-object v7, Lx/vB;->l:Lx/vB;

    .line 14
    .line 15
    new-instance v1, Lx/It;

    .line 16
    .line 17
    invoke-direct {v1}, Lx/It;-><init>()V

    .line 18
    .line 19
    .line 20
    sget-object v14, Lx/Lt;->a:Lx/Lt;

    .line 21
    .line 22
    const/4 v2, 0x0

    .line 23
    if-nez p1, :cond_0

    .line 24
    .line 25
    move-object v3, v2

    .line 26
    goto :goto_0

    .line 27
    :cond_0
    invoke-static/range {p1 .. p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    .line 28
    .line 29
    .line 30
    move-result-object v3

    .line 31
    :goto_0
    iget-object p0, p0, Lx/i9;->d:Ljava/lang/String;

    .line 32
    .line 33
    if-nez p0, :cond_1

    .line 34
    .line 35
    const-string p0, ""

    .line 36
    .line 37
    goto :goto_1

    .line 38
    :cond_1
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 39
    .line 40
    .line 41
    move-result-object p0

    .line 42
    sget-object v4, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    .line 43
    .line 44
    invoke-virtual {p0, v4}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    .line 45
    .line 46
    .line 47
    move-result-object p0

    .line 48
    :goto_1
    const-string v4, "hls"

    .line 49
    .line 50
    invoke-virtual {v4, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    .line 51
    .line 52
    .line 53
    move-result v4

    .line 54
    if-nez v4, :cond_5

    .line 55
    .line 56
    const-string v4, "m3u8"

    .line 57
    .line 58
    invoke-virtual {v4, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    .line 59
    .line 60
    .line 61
    move-result v4

    .line 62
    if-eqz v4, :cond_2

    .line 63
    .line 64
    goto :goto_4

    .line 65
    :cond_2
    const-string v4, "dash"

    .line 66
    .line 67
    invoke-virtual {v4, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    .line 68
    .line 69
    .line 70
    move-result v4

    .line 71
    if-nez v4, :cond_4

    .line 72
    .line 73
    const-string v4, "mpd"

    .line 74
    .line 75
    invoke-virtual {v4, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    .line 76
    .line 77
    .line 78
    move-result p0

    .line 79
    if-eqz p0, :cond_3

    .line 80
    .line 81
    goto :goto_3

    .line 82
    :cond_3
    :goto_2
    move-object v4, v2

    .line 83
    goto :goto_5

    .line 84
    :cond_4
    :goto_3
    const-string v2, "application/dash+xml"

    .line 85
    .line 86
    goto :goto_2

    .line 87
    :cond_5
    :goto_4
    const-string v2, "application/x-mpegURL"

    .line 88
    .line 89
    goto :goto_2

    .line 90
    :goto_5
    const/4 v5, 0x0

    .line 91
    if-eqz v3, :cond_6

    .line 92
    .line 93
    new-instance v2, Lx/Kt;

    .line 94
    .line 95
    const-wide v8, -0x7fffffffffffffffL    # -4.9E-324

    .line 96
    .line 97
    .line 98
    .line 99
    .line 100
    invoke-direct/range {v2 .. v9}, Lx/Kt;-><init>(Landroid/net/Uri;Ljava/lang/String;Lx/QK;Ljava/util/List;Lx/dp;J)V

    .line 101
    .line 102
    .line 103
    move-object v11, v2

    .line 104
    goto :goto_6

    .line 105
    :cond_6
    move-object v11, v5

    .line 106
    :goto_6
    new-instance v8, Lx/Nt;

    .line 107
    .line 108
    new-instance v10, Lx/Ht;

    .line 109
    .line 110
    invoke-direct {v10, v0}, Lx/Gt;-><init>(Lx/kk;)V

    .line 111
    .line 112
    .line 113
    new-instance v12, Lx/Jt;

    .line 114
    .line 115
    invoke-direct {v12, v1}, Lx/Jt;-><init>(Lx/It;)V

    .line 116
    .line 117
    .line 118
    sget-object v13, Lx/Rt;->C:Lx/Rt;

    .line 119
    .line 120
    const-string v9, ""

    .line 121
    .line 122
    invoke-direct/range {v8 .. v14}, Lx/Nt;-><init>(Ljava/lang/String;Lx/Ht;Lx/Kt;Lx/Jt;Lx/Rt;Lx/Lt;)V

    .line 123
    .line 124
    .line 125
    return-object v8
.end method


# virtual methods
.method public final A()V
    .locals 3

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->h0:Lx/fy;

    .line 2
    .line 3
    const/4 v1, 0x0

    .line 4
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 5
    .line 6
    if-eqz v0, :cond_0

    .line 7
    .line 8
    invoke-virtual {v2, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 9
    .line 10
    .line 11
    iput-object v1, p0, Lcom/cochi/client/PlayerActivity;->h0:Lx/fy;

    .line 12
    .line 13
    :cond_0
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->i0:Lx/fy;

    .line 14
    .line 15
    if-eqz v0, :cond_1

    .line 16
    .line 17
    invoke-virtual {v2, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 18
    .line 19
    .line 20
    iput-object v1, p0, Lcom/cochi/client/PlayerActivity;->i0:Lx/fy;

    .line 21
    .line 22
    :cond_1
    return-void
.end method

.method public final B()V
    .locals 2

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->m0:Lx/u4;

    .line 2
    .line 3
    if-eqz v0, :cond_0

    .line 4
    .line 5
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 6
    .line 7
    invoke-virtual {v1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 8
    .line 9
    .line 10
    const/4 v0, 0x0

    .line 11
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->m0:Lx/u4;

    .line 12
    .line 13
    :cond_0
    return-void
.end method

.method public final D()V
    .locals 5

    .line 1
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 2
    .line 3
    if-eqz v0, :cond_1

    .line 4
    .line 5
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 6
    .line 7
    if-nez v0, :cond_0

    .line 8
    .line 9
    goto :goto_0

    .line 10
    :cond_0
    invoke-virtual {v0}, Landroidx/media3/ui/PlayerView;->e()V

    .line 11
    .line 12
    .line 13
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 14
    .line 15
    invoke-static {v0}, Ljava/util/Objects;->requireNonNull(Ljava/lang/Object;)Ljava/lang/Object;

    .line 16
    .line 17
    .line 18
    new-instance v1, Lx/iy;

    .line 19
    .line 20
    const/4 v2, 0x0

    .line 21
    invoke-direct {v1, v0, v2}, Lx/iy;-><init>(Landroidx/media3/ui/PlayerView;I)V

    .line 22
    .line 23
    .line 24
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 25
    .line 26
    invoke-virtual {v0, v1}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 27
    .line 28
    .line 29
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 30
    .line 31
    invoke-static {v1}, Ljava/util/Objects;->requireNonNull(Ljava/lang/Object;)Ljava/lang/Object;

    .line 32
    .line 33
    .line 34
    new-instance v2, Lx/iy;

    .line 35
    .line 36
    const/4 v3, 0x0

    .line 37
    invoke-direct {v2, v1, v3}, Lx/iy;-><init>(Landroidx/media3/ui/PlayerView;I)V

    .line 38
    .line 39
    .line 40
    const-wide/16 v3, 0x78

    .line 41
    .line 42
    invoke-virtual {v0, v2, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 43
    .line 44
    .line 45
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 46
    .line 47
    invoke-static {v1}, Ljava/util/Objects;->requireNonNull(Ljava/lang/Object;)Ljava/lang/Object;

    .line 48
    .line 49
    .line 50
    new-instance v2, Lx/iy;

    .line 51
    .line 52
    const/4 v3, 0x0

    .line 53
    invoke-direct {v2, v1, v3}, Lx/iy;-><init>(Landroidx/media3/ui/PlayerView;I)V

    .line 54
    .line 55
    .line 56
    const-wide/16 v3, 0x15e

    .line 57
    .line 58
    invoke-virtual {v0, v2, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 59
    .line 60
    .line 61
    :cond_1
    :goto_0
    return-void
.end method

.method public final E()V
    .locals 2

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->L:Landroid/view/View;

    .line 2
    .line 3
    const/16 v1, 0x8

    .line 4
    .line 5
    if-eqz v0, :cond_0

    .line 6
    .line 7
    invoke-virtual {v0, v1}, Landroid/view/View;->setVisibility(I)V

    .line 8
    .line 9
    .line 10
    :cond_0
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->M:Lcom/google/android/material/button/MaterialButton;

    .line 11
    .line 12
    if-eqz v0, :cond_1

    .line 13
    .line 14
    invoke-virtual {v0, v1}, Landroid/view/View;->setVisibility(I)V

    .line 15
    .line 16
    .line 17
    :cond_1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->N:Lcom/google/android/material/button/MaterialButton;

    .line 18
    .line 19
    if-eqz v0, :cond_2

    .line 20
    .line 21
    invoke-virtual {v0, v1}, Landroid/view/View;->setVisibility(I)V

    .line 22
    .line 23
    .line 24
    :cond_2
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->O:Lcom/google/android/material/button/MaterialButton;

    .line 25
    .line 26
    if-eqz v0, :cond_3

    .line 27
    .line 28
    invoke-virtual {v0, v1}, Landroid/view/View;->setVisibility(I)V

    .line 29
    .line 30
    .line 31
    :cond_3
    return-void
.end method

.method public final F()V
    .locals 16

    .line 1
    move-object/from16 v0, p0

    .line 2
    .line 3
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 4
    .line 5
    if-nez v1, :cond_0

    .line 6
    .line 7
    goto/16 :goto_12

    .line 8
    .line 9
    :cond_0
    const v2, 0x7f0a00e4

    .line 10
    .line 11
    .line 12
    invoke-virtual {v1, v2}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    .line 13
    .line 14
    .line 15
    move-result-object v1

    .line 16
    iget-object v2, v0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 17
    .line 18
    const v3, 0x7f0a00db

    .line 19
    .line 20
    .line 21
    invoke-virtual {v2, v3}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    .line 22
    .line 23
    .line 24
    move-result-object v2

    .line 25
    iget-object v3, v0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 26
    .line 27
    const v4, 0x7f0a00e8

    .line 28
    .line 29
    .line 30
    invoke-virtual {v3, v4}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    .line 31
    .line 32
    .line 33
    move-result-object v3

    .line 34
    if-nez v3, :cond_1

    .line 35
    .line 36
    iget-object v3, v0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 37
    .line 38
    const v4, 0x7f0a00e9

    .line 39
    .line 40
    .line 41
    invoke-virtual {v3, v4}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    .line 42
    .line 43
    .line 44
    move-result-object v3

    .line 45
    :cond_1
    iget-object v4, v0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 46
    .line 47
    const v5, 0x7f0a00d2

    .line 48
    .line 49
    .line 50
    invoke-virtual {v4, v5}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    .line 51
    .line 52
    .line 53
    move-result-object v4

    .line 54
    if-nez v4, :cond_2

    .line 55
    .line 56
    iget-object v4, v0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 57
    .line 58
    const v5, 0x7f0a00d3

    .line 59
    .line 60
    .line 61
    invoke-virtual {v4, v5}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    .line 62
    .line 63
    .line 64
    move-result-object v4

    .line 65
    :cond_2
    iget-object v5, v0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 66
    .line 67
    const v6, 0x7f0a00ea

    .line 68
    .line 69
    .line 70
    invoke-virtual {v5, v6}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    .line 71
    .line 72
    .line 73
    move-result-object v5

    .line 74
    iget-object v6, v0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 75
    .line 76
    const v7, 0x7f0a00e1

    .line 77
    .line 78
    .line 79
    invoke-virtual {v6, v7}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    .line 80
    .line 81
    .line 82
    move-result-object v6

    .line 83
    iget-object v7, v0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 84
    .line 85
    const v8, 0x7f0a00e5

    .line 86
    .line 87
    .line 88
    invoke-virtual {v7, v8}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    .line 89
    .line 90
    .line 91
    move-result-object v7

    .line 92
    iget-object v8, v0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 93
    .line 94
    const/4 v9, 0x1

    .line 95
    const/4 v10, 0x0

    .line 96
    if-eqz v8, :cond_3

    .line 97
    .line 98
    invoke-virtual {v8}, Lx/Z5;->g()Z

    .line 99
    .line 100
    .line 101
    move-result v8

    .line 102
    if-eqz v8, :cond_3

    .line 103
    .line 104
    move v8, v9

    .line 105
    goto :goto_0

    .line 106
    :cond_3
    move v8, v10

    .line 107
    :goto_0
    invoke-virtual {v0}, Lcom/cochi/client/PlayerActivity;->H()Z

    .line 108
    .line 109
    .line 110
    move-result v11

    .line 111
    iget-boolean v12, v0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 112
    .line 113
    if-eqz v12, :cond_4

    .line 114
    .line 115
    invoke-static {}, Lx/o9;->d()I

    .line 116
    .line 117
    .line 118
    move-result v12

    .line 119
    if-le v12, v9, :cond_4

    .line 120
    .line 121
    move v12, v9

    .line 122
    goto :goto_1

    .line 123
    :cond_4
    move v12, v10

    .line 124
    :goto_1
    const/4 v13, 0x4

    .line 125
    if-eqz v1, :cond_9

    .line 126
    .line 127
    iget-boolean v14, v0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 128
    .line 129
    if-eqz v14, :cond_6

    .line 130
    .line 131
    if-eqz v11, :cond_6

    .line 132
    .line 133
    invoke-virtual {v1, v8}, Landroid/view/View;->setEnabled(Z)V

    .line 134
    .line 135
    .line 136
    if-eqz v8, :cond_5

    .line 137
    .line 138
    const/high16 v14, 0x3f800000    # 1.0f

    .line 139
    .line 140
    goto :goto_2

    .line 141
    :cond_5
    const v14, 0x3eb33333    # 0.35f

    .line 142
    .line 143
    .line 144
    :goto_2
    invoke-virtual {v1, v14}, Landroid/view/View;->setAlpha(F)V

    .line 145
    .line 146
    .line 147
    const-string v14, "Retroceder 5 minutos "

    .line 148
    .line 149
    invoke-virtual {v1, v14}, Landroid/view/View;->setContentDescription(Ljava/lang/CharSequence;)V

    .line 150
    .line 151
    .line 152
    new-instance v14, Lx/ey;

    .line 153
    .line 154
    const/4 v15, 0x1

    .line 155
    invoke-direct {v14, v0, v15}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 156
    .line 157
    .line 158
    invoke-virtual {v1, v14}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 159
    .line 160
    .line 161
    goto :goto_4

    .line 162
    :cond_6
    if-eqz v14, :cond_8

    .line 163
    .line 164
    invoke-virtual {v1, v12}, Landroid/view/View;->setEnabled(Z)V

    .line 165
    .line 166
    .line 167
    if-eqz v12, :cond_7

    .line 168
    .line 169
    const/high16 v14, 0x3f800000    # 1.0f

    .line 170
    .line 171
    goto :goto_3

    .line 172
    :cond_7
    const v14, 0x3eb33333    # 0.35f

    .line 173
    .line 174
    .line 175
    :goto_3
    invoke-virtual {v1, v14}, Landroid/view/View;->setAlpha(F)V

    .line 176
    .line 177
    .line 178
    const-string v14, "Canal anterior"

    .line 179
    .line 180
    invoke-virtual {v1, v14}, Landroid/view/View;->setContentDescription(Ljava/lang/CharSequence;)V

    .line 181
    .line 182
    .line 183
    new-instance v14, Lx/hy;

    .line 184
    .line 185
    const/4 v15, 0x0

    .line 186
    invoke-direct {v14, v0, v12, v15}, Lx/hy;-><init>(Lcom/cochi/client/PlayerActivity;ZI)V

    .line 187
    .line 188
    .line 189
    invoke-virtual {v1, v14}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 190
    .line 191
    .line 192
    goto :goto_4

    .line 193
    :cond_8
    invoke-virtual {v1, v13}, Landroid/view/View;->setVisibility(I)V

    .line 194
    .line 195
    .line 196
    invoke-virtual {v1, v10}, Landroid/view/View;->setEnabled(Z)V

    .line 197
    .line 198
    .line 199
    :cond_9
    :goto_4
    if-eqz v2, :cond_e

    .line 200
    .line 201
    iget-boolean v14, v0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 202
    .line 203
    if-eqz v14, :cond_b

    .line 204
    .line 205
    if-eqz v11, :cond_b

    .line 206
    .line 207
    invoke-virtual {v2, v8}, Landroid/view/View;->setEnabled(Z)V

    .line 208
    .line 209
    .line 210
    if-eqz v8, :cond_a

    .line 211
    .line 212
    const/high16 v14, 0x3f800000    # 1.0f

    .line 213
    .line 214
    goto :goto_5

    .line 215
    :cond_a
    const v14, 0x3eb33333    # 0.35f

    .line 216
    .line 217
    .line 218
    :goto_5
    invoke-virtual {v2, v14}, Landroid/view/View;->setAlpha(F)V

    .line 219
    .line 220
    .line 221
    const-string v12, "Avanzar 5 minutos "

    .line 222
    .line 223
    invoke-virtual {v2, v12}, Landroid/view/View;->setContentDescription(Ljava/lang/CharSequence;)V

    .line 224
    .line 225
    .line 226
    new-instance v12, Lx/ey;

    .line 227
    .line 228
    const/4 v14, 0x2

    .line 229
    invoke-direct {v12, v0, v14}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 230
    .line 231
    .line 232
    invoke-virtual {v2, v12}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 233
    .line 234
    .line 235
    goto :goto_7

    .line 236
    :cond_b
    if-eqz v14, :cond_d

    .line 237
    .line 238
    invoke-virtual {v2, v12}, Landroid/view/View;->setEnabled(Z)V

    .line 239
    .line 240
    .line 241
    if-eqz v12, :cond_c

    .line 242
    .line 243
    const/high16 v14, 0x3f800000    # 1.0f

    .line 244
    .line 245
    goto :goto_6

    .line 246
    :cond_c
    const v14, 0x3eb33333    # 0.35f

    .line 247
    .line 248
    .line 249
    :goto_6
    invoke-virtual {v2, v14}, Landroid/view/View;->setAlpha(F)V

    .line 250
    .line 251
    .line 252
    const-string v14, "Canal siguiente"

    .line 253
    .line 254
    invoke-virtual {v2, v14}, Landroid/view/View;->setContentDescription(Ljava/lang/CharSequence;)V

    .line 255
    .line 256
    .line 257
    new-instance v14, Lx/hy;

    .line 258
    .line 259
    const/4 v15, 0x1

    .line 260
    invoke-direct {v14, v0, v12, v15}, Lx/hy;-><init>(Lcom/cochi/client/PlayerActivity;ZI)V

    .line 261
    .line 262
    .line 263
    invoke-virtual {v2, v14}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 264
    .line 265
    .line 266
    goto :goto_7

    .line 267
    :cond_d
    invoke-virtual {v2, v13}, Landroid/view/View;->setVisibility(I)V

    .line 268
    .line 269
    .line 270
    invoke-virtual {v2, v10}, Landroid/view/View;->setEnabled(Z)V

    .line 271
    .line 272
    .line 273
    :cond_e
    :goto_7
    if-eqz v3, :cond_f

    .line 274
    .line 275
    new-instance v12, Lx/ey;

    .line 276
    .line 277
    const/4 v14, 0x3

    .line 278
    invoke-direct {v12, v0, v14}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 279
    .line 280
    .line 281
    invoke-virtual {v3, v12}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 282
    .line 283
    .line 284
    :cond_f
    if-eqz v4, :cond_10

    .line 285
    .line 286
    new-instance v12, Lx/ey;

    .line 287
    .line 288
    const/4 v14, 0x4

    .line 289
    invoke-direct {v12, v0, v14}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 290
    .line 291
    .line 292
    invoke-virtual {v4, v12}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 293
    .line 294
    .line 295
    :cond_10
    if-eqz v5, :cond_12

    .line 296
    .line 297
    if-eqz v11, :cond_11

    .line 298
    .line 299
    invoke-virtual {v5, v9}, Landroid/view/View;->setEnabled(Z)V

    .line 300
    .line 301
    .line 302
    invoke-virtual {v5, v9}, Landroid/view/View;->setClickable(Z)V

    .line 303
    .line 304
    .line 305
    const/high16 v12, 0x3f800000    # 1.0f

    .line 306
    .line 307
    invoke-virtual {v5, v12}, Landroid/view/View;->setAlpha(F)V

    .line 308
    .line 309
    .line 310
    invoke-virtual {v5, v10}, Landroid/view/View;->setVisibility(I)V

    .line 311
    .line 312
    .line 313
    new-instance v13, Lx/ey;

    .line 314
    .line 315
    const/4 v14, 0x5

    .line 316
    invoke-direct {v13, v0, v14}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 317
    .line 318
    .line 319
    invoke-virtual {v5, v13}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 320
    .line 321
    .line 322
    goto :goto_8

    .line 323
    :cond_11
    const/high16 v12, 0x3f800000    # 1.0f

    .line 324
    .line 325
    invoke-virtual {v5, v13}, Landroid/view/View;->setVisibility(I)V

    .line 326
    .line 327
    .line 328
    invoke-virtual {v5, v10}, Landroid/view/View;->setEnabled(Z)V

    .line 329
    .line 330
    .line 331
    invoke-virtual {v5, v10}, Landroid/view/View;->setClickable(Z)V

    .line 332
    .line 333
    .line 334
    goto :goto_8

    .line 335
    :cond_12
    const/high16 v12, 0x3f800000    # 1.0f

    .line 336
    .line 337
    :goto_8
    if-eqz v11, :cond_13

    .line 338
    .line 339
    invoke-virtual {v0, v1}, Lcom/cochi/client/PlayerActivity;->s(Landroid/view/View;)V

    .line 340
    .line 341
    .line 342
    invoke-virtual {v0, v3}, Lcom/cochi/client/PlayerActivity;->s(Landroid/view/View;)V

    .line 343
    .line 344
    .line 345
    invoke-virtual {v0, v6}, Lcom/cochi/client/PlayerActivity;->s(Landroid/view/View;)V

    .line 346
    .line 347
    .line 348
    invoke-virtual {v0, v4}, Lcom/cochi/client/PlayerActivity;->s(Landroid/view/View;)V

    .line 349
    .line 350
    .line 351
    invoke-virtual {v0, v2}, Lcom/cochi/client/PlayerActivity;->s(Landroid/view/View;)V

    .line 352
    .line 353
    .line 354
    invoke-virtual {v0, v5}, Lcom/cochi/client/PlayerActivity;->s(Landroid/view/View;)V

    .line 355
    .line 356
    .line 357
    iget-boolean v1, v0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 358
    .line 359
    if-eqz v1, :cond_13

    .line 360
    .line 361
    iget-boolean v1, v0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 362
    .line 363
    if-nez v1, :cond_13

    .line 364
    .line 365
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 366
    .line 367
    invoke-virtual {v0, v1}, Lcom/cochi/client/PlayerActivity;->s(Landroid/view/View;)V

    .line 368
    .line 369
    .line 370
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 371
    .line 372
    invoke-virtual {v0, v1}, Lcom/cochi/client/PlayerActivity;->s(Landroid/view/View;)V

    .line 373
    .line 374
    .line 375
    :cond_13
    if-eqz v11, :cond_17

    .line 376
    .line 377
    iget-boolean v1, v0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 378
    .line 379
    if-eqz v1, :cond_17

    .line 380
    .line 381
    iget-boolean v1, v0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 382
    .line 383
    if-nez v1, :cond_17

    .line 384
    .line 385
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 386
    .line 387
    if-eqz v1, :cond_17

    .line 388
    .line 389
    iget-object v2, v0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 390
    .line 391
    if-eqz v2, :cond_17

    .line 392
    .line 393
    invoke-virtual {v1, v9}, Landroid/view/View;->setFocusable(Z)V

    .line 394
    .line 395
    .line 396
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 397
    .line 398
    invoke-virtual {v1, v10}, Landroid/view/View;->setFocusableInTouchMode(Z)V

    .line 399
    .line 400
    .line 401
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 402
    .line 403
    invoke-virtual {v1, v9}, Landroid/view/View;->setFocusable(Z)V

    .line 404
    .line 405
    .line 406
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 407
    .line 408
    invoke-virtual {v1, v10}, Landroid/view/View;->setFocusableInTouchMode(Z)V

    .line 409
    .line 410
    .line 411
    if-eqz v3, :cond_14

    .line 412
    .line 413
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 414
    .line 415
    invoke-virtual {v3}, Landroid/view/View;->getId()I

    .line 416
    .line 417
    .line 418
    move-result v2

    .line 419
    invoke-virtual {v1, v2}, Landroid/view/View;->setNextFocusRightId(I)V

    .line 420
    .line 421
    .line 422
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 423
    .line 424
    invoke-virtual {v1}, Landroid/view/View;->getId()I

    .line 425
    .line 426
    .line 427
    move-result v1

    .line 428
    invoke-virtual {v3, v1}, Landroid/view/View;->setNextFocusLeftId(I)V

    .line 429
    .line 430
    .line 431
    :cond_14
    if-eqz v3, :cond_15

    .line 432
    .line 433
    if-eqz v6, :cond_15

    .line 434
    .line 435
    invoke-virtual {v6}, Landroid/view/View;->getId()I

    .line 436
    .line 437
    .line 438
    move-result v1

    .line 439
    invoke-virtual {v3, v1}, Landroid/view/View;->setNextFocusRightId(I)V

    .line 440
    .line 441
    .line 442
    invoke-virtual {v3}, Landroid/view/View;->getId()I

    .line 443
    .line 444
    .line 445
    move-result v1

    .line 446
    invoke-virtual {v6, v1}, Landroid/view/View;->setNextFocusLeftId(I)V

    .line 447
    .line 448
    .line 449
    :cond_15
    if-eqz v6, :cond_16

    .line 450
    .line 451
    if-eqz v4, :cond_16

    .line 452
    .line 453
    invoke-virtual {v4}, Landroid/view/View;->getId()I

    .line 454
    .line 455
    .line 456
    move-result v1

    .line 457
    invoke-virtual {v6, v1}, Landroid/view/View;->setNextFocusRightId(I)V

    .line 458
    .line 459
    .line 460
    invoke-virtual {v6}, Landroid/view/View;->getId()I

    .line 461
    .line 462
    .line 463
    move-result v1

    .line 464
    invoke-virtual {v4, v1}, Landroid/view/View;->setNextFocusLeftId(I)V

    .line 465
    .line 466
    .line 467
    :cond_16
    if-eqz v4, :cond_17

    .line 468
    .line 469
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 470
    .line 471
    invoke-virtual {v1}, Landroid/view/View;->getId()I

    .line 472
    .line 473
    .line 474
    move-result v1

    .line 475
    invoke-virtual {v4, v1}, Landroid/view/View;->setNextFocusRightId(I)V

    .line 476
    .line 477
    .line 478
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 479
    .line 480
    invoke-virtual {v4}, Landroid/view/View;->getId()I

    .line 481
    .line 482
    .line 483
    move-result v2

    .line 484
    invoke-virtual {v1, v2}, Landroid/view/View;->setNextFocusLeftId(I)V

    .line 485
    .line 486
    .line 487
    :cond_17
    if-eqz v7, :cond_29

    .line 488
    .line 489
    if-eqz v11, :cond_18

    .line 490
    .line 491
    iget-boolean v1, v0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 492
    .line 493
    if-eqz v1, :cond_18

    .line 494
    .line 495
    iget-boolean v1, v0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 496
    .line 497
    if-nez v1, :cond_18

    .line 498
    .line 499
    move v1, v9

    .line 500
    goto :goto_9

    .line 501
    :cond_18
    move v1, v10

    .line 502
    :goto_9
    if-eqz v11, :cond_19

    .line 503
    .line 504
    iget-boolean v2, v0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 505
    .line 506
    if-eqz v2, :cond_19

    .line 507
    .line 508
    if-eqz v8, :cond_19

    .line 509
    .line 510
    move v2, v9

    .line 511
    goto :goto_a

    .line 512
    :cond_19
    move v2, v10

    .line 513
    :goto_a
    if-nez v1, :cond_1b

    .line 514
    .line 515
    if-eqz v2, :cond_1a

    .line 516
    .line 517
    goto :goto_b

    .line 518
    :cond_1a
    move v2, v10

    .line 519
    goto :goto_c

    .line 520
    :cond_1b
    :goto_b
    move v2, v9

    .line 521
    :goto_c
    invoke-virtual {v7, v2}, Landroid/view/View;->setFocusable(Z)V

    .line 522
    .line 523
    .line 524
    invoke-virtual {v7, v10}, Landroid/view/View;->setFocusableInTouchMode(Z)V

    .line 525
    .line 526
    .line 527
    iget-boolean v2, v0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 528
    .line 529
    if-eqz v2, :cond_1d

    .line 530
    .line 531
    if-eqz v8, :cond_1c

    .line 532
    .line 533
    goto :goto_d

    .line 534
    :cond_1c
    move v9, v10

    .line 535
    :cond_1d
    :goto_d
    invoke-virtual {v7, v9}, Landroid/view/View;->setEnabled(Z)V

    .line 536
    .line 537
    .line 538
    iget-boolean v2, v0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 539
    .line 540
    if-eqz v2, :cond_1f

    .line 541
    .line 542
    if-eqz v8, :cond_1e

    .line 543
    .line 544
    goto :goto_e

    .line 545
    :cond_1e
    const v15, 0x3ee66666    # 0.45f

    .line 546
    .line 547
    .line 548
    goto :goto_f

    .line 549
    :cond_1f
    :goto_e
    move v15, v12

    .line 550
    :goto_f
    invoke-virtual {v7, v15}, Landroid/view/View;->setAlpha(F)V

    .line 551
    .line 552
    .line 553
    if-eqz v1, :cond_26

    .line 554
    .line 555
    const-string v1, "Barra de progreso. Izquierda y derecha desplazan la reproducci\u00f3n"

    .line 556
    .line 557
    invoke-virtual {v7, v1}, Landroid/view/View;->setContentDescription(Ljava/lang/CharSequence;)V

    .line 558
    .line 559
    .line 560
    invoke-virtual {v7}, Landroid/view/View;->getId()I

    .line 561
    .line 562
    .line 563
    move-result v1

    .line 564
    iget-object v2, v0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 565
    .line 566
    if-eqz v2, :cond_20

    .line 567
    .line 568
    invoke-virtual {v2, v1}, Landroid/view/View;->setNextFocusUpId(I)V

    .line 569
    .line 570
    .line 571
    :cond_20
    if-eqz v3, :cond_21

    .line 572
    .line 573
    invoke-virtual {v3, v1}, Landroid/view/View;->setNextFocusUpId(I)V

    .line 574
    .line 575
    .line 576
    :cond_21
    if-eqz v6, :cond_22

    .line 577
    .line 578
    invoke-virtual {v6, v1}, Landroid/view/View;->setNextFocusUpId(I)V

    .line 579
    .line 580
    .line 581
    :cond_22
    if-eqz v4, :cond_23

    .line 582
    .line 583
    invoke-virtual {v4, v1}, Landroid/view/View;->setNextFocusUpId(I)V

    .line 584
    .line 585
    .line 586
    :cond_23
    iget-object v2, v0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 587
    .line 588
    if-eqz v2, :cond_24

    .line 589
    .line 590
    invoke-virtual {v2, v1}, Landroid/view/View;->setNextFocusUpId(I)V

    .line 591
    .line 592
    .line 593
    :cond_24
    if-eqz v5, :cond_25

    .line 594
    .line 595
    invoke-virtual {v5}, Landroid/view/View;->getId()I

    .line 596
    .line 597
    .line 598
    move-result v2

    .line 599
    invoke-virtual {v7, v2}, Landroid/view/View;->setNextFocusDownId(I)V

    .line 600
    .line 601
    .line 602
    invoke-virtual {v5, v1}, Landroid/view/View;->setNextFocusUpId(I)V

    .line 603
    .line 604
    .line 605
    goto :goto_11

    .line 606
    :cond_25
    if-eqz v6, :cond_28

    .line 607
    .line 608
    invoke-virtual {v6}, Landroid/view/View;->getId()I

    .line 609
    .line 610
    .line 611
    move-result v1

    .line 612
    invoke-virtual {v7, v1}, Landroid/view/View;->setNextFocusDownId(I)V

    .line 613
    .line 614
    .line 615
    goto :goto_11

    .line 616
    :cond_26
    if-eqz v8, :cond_27

    .line 617
    .line 618
    const-string v1, "Barra DVR. Izquierda y derecha mueven 5 minutos "

    .line 619
    .line 620
    goto :goto_10

    .line 621
    :cond_27
    const-string v1, "Canal en vivo sin DVR"

    .line 622
    .line 623
    :goto_10
    invoke-virtual {v7, v1}, Landroid/view/View;->setContentDescription(Ljava/lang/CharSequence;)V

    .line 624
    .line 625
    .line 626
    :cond_28
    :goto_11
    instance-of v1, v7, Lx/uf;

    .line 627
    .line 628
    if-eqz v1, :cond_29

    .line 629
    .line 630
    iget-boolean v1, v0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 631
    .line 632
    if-eqz v1, :cond_29

    .line 633
    .line 634
    check-cast v7, Lx/uf;

    .line 635
    .line 636
    const-wide/32 v1, 0x493e0

    .line 637
    .line 638
    .line 639
    invoke-virtual {v7, v1, v2}, Lx/uf;->setKeyTimeIncrement(J)V

    .line 640
    .line 641
    .line 642
    :cond_29
    :goto_12
    return-void
.end method

.method public final H()Z
    .locals 2

    .line 1
    const-string v0, "uimode"

    .line 2
    .line 3
    invoke-virtual {p0, v0}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    .line 4
    .line 5
    .line 6
    move-result-object v0

    .line 7
    check-cast v0, Landroid/app/UiModeManager;

    .line 8
    .line 9
    if-eqz v0, :cond_0

    .line 10
    .line 11
    invoke-virtual {v0}, Landroid/app/UiModeManager;->getCurrentModeType()I

    .line 12
    .line 13
    .line 14
    move-result v0

    .line 15
    const/4 v1, 0x4

    .line 16
    if-eq v0, v1, :cond_2

    .line 17
    .line 18
    :cond_0
    invoke-virtual {p0}, Landroid/content/Context;->getPackageManager()Landroid/content/pm/PackageManager;

    .line 19
    .line 20
    .line 21
    move-result-object v0

    .line 22
    const-string v1, "android.software.leanback"

    .line 23
    .line 24
    invoke-virtual {v0, v1}, Landroid/content/pm/PackageManager;->hasSystemFeature(Ljava/lang/String;)Z

    .line 25
    .line 26
    .line 27
    move-result v0

    .line 28
    if-nez v0, :cond_2

    .line 29
    .line 30
    invoke-virtual {p0}, Landroid/content/Context;->getPackageManager()Landroid/content/pm/PackageManager;

    .line 31
    .line 32
    .line 33
    move-result-object v0

    .line 34
    const-string v1, "android.hardware.type.television"

    .line 35
    .line 36
    invoke-virtual {v0, v1}, Landroid/content/pm/PackageManager;->hasSystemFeature(Ljava/lang/String;)Z

    .line 37
    .line 38
    .line 39
    move-result v0

    .line 40
    if-eqz v0, :cond_1

    .line 41
    .line 42
    goto :goto_0

    .line 43
    :cond_1
    const/4 v0, 0x0

    .line 44
    return v0

    .line 45
    :cond_2
    :goto_0
    const/4 v0, 0x1

    .line 46
    return v0
.end method

.method public final K(Lx/i9;J)V
    .locals 12

    .line 1
    iget-object v0, p1, Lx/i9;->e:Ljava/lang/String;

    .line 2
    .line 3
    if-nez v0, :cond_0

    .line 4
    .line 5
    const-string v3, ""

    .line 6
    .line 7
    :goto_0
    move-object v4, v3

    .line 8
    goto :goto_1

    .line 9
    :cond_0
    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 10
    .line 11
    .line 12
    move-result-object v3

    .line 13
    goto :goto_0

    .line 14
    :goto_1
    const/4 v8, 0x0

    .line 15
    const/16 v9, 0x10

    .line 16
    .line 17
    const/4 v5, 0x1

    .line 18
    const/4 v6, 0x0

    .line 19
    const-string v7, "cochi-private://"

    .line 20
    .line 21
    invoke-virtual/range {v4 .. v9}, Ljava/lang/String;->regionMatches(ZILjava/lang/String;II)Z

    .line 22
    .line 23
    .line 24
    move-result v3

    .line 25
    const/4 v5, 0x0

    .line 26
    const/4 v6, 0x1

    .line 27
    if-eqz v3, :cond_1

    .line 28
    .line 29
    goto :goto_2

    .line 30
    :cond_1
    sget-object v3, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    .line 31
    .line 32
    invoke-virtual {v4, v3}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    .line 33
    .line 34
    .line 35
    move-result-object v4

    .line 36
    const-string v7, "https://githab.com/"

    .line 37
    .line 38
    invoke-virtual {v4, v7}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    .line 39
    .line 40
    .line 41
    move-result v7

    .line 42
    if-eqz v7, :cond_3

    .line 43
    .line 44
    const-string v7, "/releases/download/"

    .line 45
    .line 46
    invoke-virtual {v4, v7}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    .line 47
    .line 48
    .line 49
    move-result v4

    .line 50
    if-eqz v4, :cond_3

    .line 51
    .line 52
    :goto_2
    if-eqz v0, :cond_11

    .line 53
    .line 54
    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 55
    .line 56
    .line 57
    move-result-object v0

    .line 58
    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    .line 59
    .line 60
    .line 61
    move-result v0

    .line 62
    if-eqz v0, :cond_2

    .line 63
    .line 64
    goto/16 :goto_8

    .line 65
    .line 66
    :cond_2
    iget v0, p0, Lcom/cochi/client/PlayerActivity;->b0:I

    .line 67
    .line 68
    add-int/lit8 v3, v0, 0x1

    .line 69
    .line 70
    iput v3, p0, Lcom/cochi/client/PlayerActivity;->b0:I

    .line 71
    .line 72
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->H:Landroid/widget/ProgressBar;

    .line 73
    .line 74
    invoke-virtual {v0, v5}, Landroid/view/View;->setVisibility(I)V

    .line 75
    .line 76
    .line 77
    invoke-virtual/range {p0 .. p1}, Lcom/cochi/client/PlayerActivity;->V(Lx/i9;)V

    .line 78
    .line 79
    .line 80
    new-instance v6, Ljava/lang/Thread;

    .line 81
    .line 82
    new-instance v0, Lx/jy;

    .line 83
    .line 84
    move-object v1, p0

    .line 85
    move-object v2, p1

    .line 86
    move-wide v4, p2

    .line 87
    invoke-direct/range {v0 .. v5}, Lx/jy;-><init>(Lcom/cochi/client/PlayerActivity;Lx/i9;IJ)V

    .line 88
    .line 89
    .line 90
    const-string v2, "cochi-private-media-resolve"

    .line 91
    .line 92
    invoke-direct {v6, v0, v2}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;Ljava/lang/String;)V

    .line 93
    .line 94
    .line 95
    invoke-virtual {v6}, Ljava/lang/Thread;->start()V

    .line 96
    .line 97
    .line 98
    return-void

    .line 99
    :cond_3
    iget-object v0, p1, Lx/i9;->e:Ljava/lang/String;

    .line 100
    .line 101
    iget-object v4, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 102
    .line 103
    sget-object v7, Lx/P8;->i:Lx/P8;

    .line 104
    .line 105
    if-ne v4, v7, :cond_4

    .line 106
    .line 107
    if-eqz v0, :cond_4

    .line 108
    .line 109
    const-string v4, "cochi://resolve/tv2/"

    .line 110
    .line 111
    invoke-virtual {v0, v4}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    .line 112
    .line 113
    .line 114
    move-result v4

    .line 115
    if-eqz v4, :cond_4

    .line 116
    .line 117
    const/16 v3, 0x14

    .line 118
    .line 119
    invoke-virtual {v0, v3}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    .line 120
    .line 121
    .line 122
    move-result-object v0

    .line 123
    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 124
    .line 125
    .line 126
    move-result-object v0

    .line 127
    iget v3, p0, Lcom/cochi/client/PlayerActivity;->a0:I

    .line 128
    .line 129
    add-int/2addr v3, v6

    .line 130
    iput v3, p0, Lcom/cochi/client/PlayerActivity;->a0:I

    .line 131
    .line 132
    iget-object v4, p0, Lcom/cochi/client/PlayerActivity;->H:Landroid/widget/ProgressBar;

    .line 133
    .line 134
    invoke-virtual {v4, v5}, Landroid/view/View;->setVisibility(I)V

    .line 135
    .line 136
    .line 137
    invoke-virtual/range {p0 .. p1}, Lcom/cochi/client/PlayerActivity;->V(Lx/i9;)V

    .line 138
    .line 139
    .line 140
    new-instance v7, Ljava/lang/Thread;

    .line 141
    .line 142
    move-object v2, v0

    .line 143
    new-instance v0, Lx/gy;

    .line 144
    .line 145
    move-object v1, p0

    .line 146
    move-object v4, p1

    .line 147
    move-wide v5, p2

    .line 148
    invoke-direct/range {v0 .. v6}, Lx/gy;-><init>(Lcom/cochi/client/PlayerActivity;Ljava/lang/String;ILx/i9;J)V

    .line 149
    .line 150
    .line 151
    const-string v2, "cochi-tv2-resolve"

    .line 152
    .line 153
    invoke-direct {v7, v0, v2}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;Ljava/lang/String;)V

    .line 154
    .line 155
    .line 156
    invoke-virtual {v7}, Ljava/lang/Thread;->start()V

    .line 157
    .line 158
    .line 159
    return-void

    .line 160
    :cond_4
    iget-object v0, p1, Lx/i9;->d:Ljava/lang/String;

    .line 161
    .line 162
    iget-object v4, p1, Lx/i9;->e:Ljava/lang/String;

    .line 163
    .line 164
    const-string v7, "youtube"

    .line 165
    .line 166
    invoke-virtual {v7, v0}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    .line 167
    .line 168
    .line 169
    move-result v0

    .line 170
    if-nez v0, :cond_7

    .line 171
    .line 172
    if-nez v4, :cond_5

    .line 173
    .line 174
    goto :goto_3

    .line 175
    :cond_5
    invoke-virtual {v4, v3}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    .line 176
    .line 177
    .line 178
    move-result-object v0

    .line 179
    const-string v3, "youtube.com/"

    .line 180
    .line 181
    invoke-virtual {v0, v3}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    .line 182
    .line 183
    .line 184
    move-result v3

    .line 185
    if-nez v3, :cond_7

    .line 186
    .line 187
    const-string v3, "youtu.be/"

    .line 188
    .line 189
    invoke-virtual {v0, v3}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    .line 190
    .line 191
    .line 192
    move-result v0

    .line 193
    if-eqz v0, :cond_6

    .line 194
    .line 195
    goto :goto_4

    .line 196
    :cond_6
    :goto_3
    move v0, v5

    .line 197
    goto :goto_5

    .line 198
    :cond_7
    :goto_4
    move v0, v6

    .line 199
    :goto_5
    iget v3, p0, Lcom/cochi/client/PlayerActivity;->f0:I

    .line 200
    .line 201
    add-int/2addr v3, v6

    .line 202
    iput v3, p0, Lcom/cochi/client/PlayerActivity;->f0:I

    .line 203
    .line 204
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->A()V

    .line 205
    .line 206
    .line 207
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 208
    .line 209
    iget-object v7, p0, Lcom/cochi/client/PlayerActivity;->V:Lx/dy;

    .line 210
    .line 211
    invoke-virtual {v3, v7}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 212
    .line 213
    .line 214
    iget-object v7, p0, Lcom/cochi/client/PlayerActivity;->v0:Lx/ry;

    .line 215
    .line 216
    invoke-virtual {v3, v7}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 217
    .line 218
    .line 219
    iget-object v7, p0, Lcom/cochi/client/PlayerActivity;->w0:Lx/ry;

    .line 220
    .line 221
    invoke-virtual {v3, v7}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 222
    .line 223
    .line 224
    iget-object v7, p0, Lcom/cochi/client/PlayerActivity;->x0:Lx/ry;

    .line 225
    .line 226
    invoke-virtual {v3, v7}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 227
    .line 228
    .line 229
    iget-object v7, p0, Lcom/cochi/client/PlayerActivity;->n0:Lx/ry;

    .line 230
    .line 231
    invoke-virtual {v3, v7}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 232
    .line 233
    .line 234
    iput v5, p0, Lcom/cochi/client/PlayerActivity;->d0:I

    .line 235
    .line 236
    const-wide/16 v7, 0x0

    .line 237
    .line 238
    iput-wide v7, p0, Lcom/cochi/client/PlayerActivity;->e0:J

    .line 239
    .line 240
    iput-boolean v5, p0, Lcom/cochi/client/PlayerActivity;->j0:Z

    .line 241
    .line 242
    iput-boolean v5, p0, Lcom/cochi/client/PlayerActivity;->k0:Z

    .line 243
    .line 244
    iput-boolean v5, p0, Lcom/cochi/client/PlayerActivity;->l0:Z

    .line 245
    .line 246
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->B()V

    .line 247
    .line 248
    .line 249
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->P:Landroid/view/View;

    .line 250
    .line 251
    const/16 v7, 0x8

    .line 252
    .line 253
    if-eqz v3, :cond_8

    .line 254
    .line 255
    invoke-virtual {v3, v7}, Landroid/view/View;->setVisibility(I)V

    .line 256
    .line 257
    .line 258
    :cond_8
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 259
    .line 260
    if-eqz v3, :cond_9

    .line 261
    .line 262
    invoke-virtual {v3, v7}, Landroid/view/View;->setVisibility(I)V

    .line 263
    .line 264
    .line 265
    :cond_9
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->H:Landroid/widget/ProgressBar;

    .line 266
    .line 267
    invoke-virtual {v3, v5}, Landroid/view/View;->setVisibility(I)V

    .line 268
    .line 269
    .line 270
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 271
    .line 272
    if-eqz v3, :cond_b

    .line 273
    .line 274
    const/4 v8, 0x0

    .line 275
    if-nez v0, :cond_a

    .line 276
    .line 277
    :try_start_0
    invoke-virtual {v3}, Lx/nj;->c0()V

    .line 278
    .line 279
    .line 280
    invoke-virtual {v3, v8}, Lx/nj;->X(Lx/Xi;)V

    .line 281
    .line 282
    .line 283
    new-instance v8, Lx/Vc;

    .line 284
    .line 285
    sget-object v9, Lx/vB;->l:Lx/vB;

    .line 286
    .line 287
    iget-object v10, v3, Lx/nj;->n0:Lx/Jx;

    .line 288
    .line 289
    iget-wide v10, v10, Lx/Jx;->s:J

    .line 290
    .line 291
    invoke-direct {v8, v9}, Lx/Vc;-><init>(Ljava/util/List;)V

    .line 292
    .line 293
    .line 294
    iput-object v8, v3, Lx/nj;->d0:Lx/Vc;

    .line 295
    .line 296
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 297
    .line 298
    invoke-virtual {v3}, Lx/Z5;->a()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 299
    .line 300
    .line 301
    goto :goto_6

    .line 302
    :cond_a
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 303
    .line 304
    invoke-virtual {v3, v8}, Landroidx/media3/ui/PlayerView;->setPlayer(Lx/cy;)V

    .line 305
    .line 306
    .line 307
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 308
    .line 309
    invoke-virtual {v3}, Lx/nj;->O()V

    .line 310
    .line 311
    .line 312
    iput-object v8, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 313
    .line 314
    :catch_0
    :cond_b
    :goto_6
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 315
    .line 316
    if-eqz v3, :cond_c

    .line 317
    .line 318
    invoke-virtual {v3}, Landroid/view/View;->getVisibility()I

    .line 319
    .line 320
    .line 321
    move-result v3

    .line 322
    if-nez v3, :cond_c

    .line 323
    .line 324
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 325
    .line 326
    invoke-virtual {v3}, Landroid/webkit/WebView;->stopLoading()V

    .line 327
    .line 328
    .line 329
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 330
    .line 331
    const-string v8, "about:blank"

    .line 332
    .line 333
    invoke-virtual {v3, v8}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V

    .line 334
    .line 335
    .line 336
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 337
    .line 338
    invoke-virtual {v3}, Landroid/webkit/WebView;->clearHistory()V

    .line 339
    .line 340
    .line 341
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 342
    .line 343
    invoke-virtual {v3}, Landroid/webkit/WebView;->onPause()V

    .line 344
    .line 345
    .line 346
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 347
    .line 348
    invoke-virtual {v3, v7}, Landroid/view/View;->setVisibility(I)V

    .line 349
    .line 350
    .line 351
    :cond_c
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->g0:Lx/i9;

    .line 352
    .line 353
    invoke-virtual/range {p0 .. p1}, Lcom/cochi/client/PlayerActivity;->V(Lx/i9;)V

    .line 354
    .line 355
    .line 356
    iget-object v3, p1, Lx/i9;->f:Ljava/lang/String;

    .line 357
    .line 358
    invoke-virtual {v3}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 359
    .line 360
    .line 361
    move-result-object v3

    .line 362
    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    .line 363
    .line 364
    .line 365
    move-result v3

    .line 366
    if-nez v3, :cond_d

    .line 367
    .line 368
    invoke-virtual/range {p0 .. p3}, Lcom/cochi/client/PlayerActivity;->O(Lx/i9;J)V

    .line 369
    .line 370
    .line 371
    goto/16 :goto_8

    .line 372
    .line 373
    :cond_d
    if-eqz v0, :cond_10

    .line 374
    .line 375
    invoke-static {v4}, Lx/qx;->L(Ljava/lang/String;)Ljava/lang/String;

    .line 376
    .line 377
    .line 378
    move-result-object v0

    .line 379
    if-eqz v0, :cond_f

    .line 380
    .line 381
    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    .line 382
    .line 383
    .line 384
    move-result v2

    .line 385
    if-eqz v2, :cond_e

    .line 386
    .line 387
    goto :goto_7

    .line 388
    :cond_e
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->H:Landroid/widget/ProgressBar;

    .line 389
    .line 390
    invoke-virtual {v2, v7}, Landroid/view/View;->setVisibility(I)V

    .line 391
    .line 392
    .line 393
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 394
    .line 395
    invoke-virtual {v2, v7}, Landroidx/media3/ui/PlayerView;->setVisibility(I)V

    .line 396
    .line 397
    .line 398
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 399
    .line 400
    invoke-virtual {v2}, Landroid/webkit/WebView;->stopLoading()V

    .line 401
    .line 402
    .line 403
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 404
    .line 405
    invoke-virtual {v2}, Landroid/webkit/WebView;->onResume()V

    .line 406
    .line 407
    .line 408
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 409
    .line 410
    invoke-virtual {v2}, Landroid/webkit/WebView;->resumeTimers()V

    .line 411
    .line 412
    .line 413
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 414
    .line 415
    invoke-virtual {v2, v5}, Landroid/view/View;->setVisibility(I)V

    .line 416
    .line 417
    .line 418
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 419
    .line 420
    invoke-virtual {v2}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;

    .line 421
    .line 422
    .line 423
    move-result-object v2

    .line 424
    invoke-virtual {v2, v6}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V

    .line 425
    .line 426
    .line 427
    invoke-virtual {v2, v6}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V

    .line 428
    .line 429
    .line 430
    invoke-virtual {v2, v5}, Landroid/webkit/WebSettings;->setMediaPlaybackRequiresUserGesture(Z)V

    .line 431
    .line 432
    .line 433
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 434
    .line 435
    new-instance v3, Landroid/webkit/WebChromeClient;

    .line 436
    .line 437
    invoke-direct {v3}, Landroid/webkit/WebChromeClient;-><init>()V

    .line 438
    .line 439
    .line 440
    invoke-virtual {v2, v3}, Landroid/webkit/WebView;->setWebChromeClient(Landroid/webkit/WebChromeClient;)V

    .line 441
    .line 442
    .line 443
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 444
    .line 445
    new-instance v3, Landroid/webkit/WebViewClient;

    .line 446
    .line 447
    invoke-direct {v3}, Landroid/webkit/WebViewClient;-><init>()V

    .line 448
    .line 449
    .line 450
    invoke-virtual {v2, v3}, Landroid/webkit/WebView;->setWebViewClient(Landroid/webkit/WebViewClient;)V

    .line 451
    .line 452
    .line 453
    new-instance v2, Ljava/lang/StringBuilder;

    .line 454
    .line 455
    const-string v3, "<!doctype html><html><head><meta name=\'viewport\' content=\'width=device-width,height=device-height,initial-scale=1,maximum-scale=1,user-scalable=no\'><meta name=\'referrer\' content=\'strict-origin-when-cross-origin\'><style>html,body{margin:0;background:#000;width:100%;height:100%;overflow:hidden}iframe{width:100%;height:100%;border:0}</style></head><body><iframe src=\'https://www.youtube.com/embed/"

    .line 456
    .line 457
    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 458
    .line 459
    .line 460
    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 461
    .line 462
    .line 463
    const-string v0, "?autoplay=1&playsinline=1&origin=https%3A%2F%2Fcom.cochi.client\' allow=\'autoplay; encrypted-media; picture-in-picture\' allowfullscreen></iframe></body></html>"

    .line 464
    .line 465
    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 466
    .line 467
    .line 468
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 469
    .line 470
    .line 471
    move-result-object v5

    .line 472
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 473
    .line 474
    const-string v7, "UTF-8"

    .line 475
    .line 476
    const/4 v8, 0x0

    .line 477
    const-string v4, "https://com.cochi.client/"

    .line 478
    .line 479
    const-string v6, "text/html"

    .line 480
    .line 481
    invoke-virtual/range {v3 .. v8}, Landroid/webkit/WebView;->loadDataWithBaseURL(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 482
    .line 483
    .line 484
    goto :goto_8

    .line 485
    :cond_f
    :goto_7
    const-string v0, "No pude identificar el video de YouTube"

    .line 486
    .line 487
    invoke-static {p0, v0, v6}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    .line 488
    .line 489
    .line 490
    move-result-object v0

    .line 491
    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    .line 492
    .line 493
    .line 494
    goto :goto_8

    .line 495
    :cond_10
    invoke-virtual/range {p0 .. p3}, Lcom/cochi/client/PlayerActivity;->N(Lx/i9;J)V

    .line 496
    .line 497
    .line 498
    :cond_11
    :goto_8
    return-void
.end method

.method public final L(IJ)V
    .locals 8

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 2
    .line 3
    sget-object v1, Lx/P8;->k:Lx/P8;

    .line 4
    .line 5
    if-ne v0, v1, :cond_0

    .line 6
    .line 7
    new-instance v2, Lx/fy;

    .line 8
    .line 9
    const/4 v7, 0x2

    .line 10
    move-object v3, p0

    .line 11
    move v4, p1

    .line 12
    move-wide v5, p2

    .line 13
    invoke-direct/range {v2 .. v7}, Lx/fy;-><init>(Lcom/cochi/client/PlayerActivity;IJI)V

    .line 14
    .line 15
    .line 16
    const/4 p1, 0x1

    .line 17
    invoke-virtual {p0, p1, v2}, Lcom/cochi/client/PlayerActivity;->c0(ZLx/fy;)V

    .line 18
    .line 19
    .line 20
    return-void

    .line 21
    :cond_0
    move-object v3, p0

    .line 22
    move v4, p1

    .line 23
    move-wide v5, p2

    .line 24
    invoke-virtual {p0, v4, v5, v6}, Lcom/cochi/client/PlayerActivity;->M(IJ)V

    .line 25
    .line 26
    .line 27
    return-void
.end method

.method public final M(IJ)V
    .locals 12

    .line 1
    invoke-static {}, Lx/o9;->d()I

    .line 2
    .line 3
    .line 4
    move-result v0

    .line 5
    const/4 v1, 0x0

    .line 6
    if-nez v0, :cond_7

    .line 7
    .line 8
    const-string p1, ""

    .line 9
    .line 10
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 11
    .line 12
    .line 13
    move-result-object p2

    .line 14
    const-string p3, "cochi.extra.URL"

    .line 15
    .line 16
    invoke-virtual {p2, p3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 17
    .line 18
    .line 19
    move-result-object v6

    .line 20
    if-eqz v6, :cond_6

    .line 21
    .line 22
    invoke-virtual {v6}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 23
    .line 24
    .line 25
    move-result-object p2

    .line 26
    invoke-virtual {p2}, Ljava/lang/String;->isEmpty()Z

    .line 27
    .line 28
    .line 29
    move-result p2

    .line 30
    if-eqz p2, :cond_0

    .line 31
    .line 32
    goto/16 :goto_2

    .line 33
    .line 34
    :cond_0
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 35
    .line 36
    .line 37
    move-result-object p2

    .line 38
    const-string p3, "cochi.extra.STREAM_TYPE"

    .line 39
    .line 40
    invoke-virtual {p2, p3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 41
    .line 42
    .line 43
    move-result-object p2

    .line 44
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 45
    .line 46
    .line 47
    move-result-object p3

    .line 48
    const-string v0, "cochi.extra.DISPLAY_NAME"

    .line 49
    .line 50
    invoke-virtual {p3, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 51
    .line 52
    .line 53
    move-result-object p3

    .line 54
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 55
    .line 56
    .line 57
    move-result-object v0

    .line 58
    const-string v2, "cochi.extra.CLEARKEY_MULTI"

    .line 59
    .line 60
    invoke-virtual {v0, v2}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 61
    .line 62
    .line 63
    move-result-object v0

    .line 64
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 65
    .line 66
    .line 67
    move-result-object v2

    .line 68
    const-string v3, "cochi.extra.HEADERS_JSON"

    .line 69
    .line 70
    invoke-virtual {v2, v3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 71
    .line 72
    .line 73
    move-result-object v2

    .line 74
    new-instance v8, Ljava/util/LinkedHashMap;

    .line 75
    .line 76
    invoke-direct {v8}, Ljava/util/LinkedHashMap;-><init>()V

    .line 77
    .line 78
    .line 79
    if-eqz v2, :cond_2

    .line 80
    .line 81
    invoke-virtual {v2}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 82
    .line 83
    .line 84
    move-result-object v3

    .line 85
    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    .line 86
    .line 87
    .line 88
    move-result v3

    .line 89
    if-nez v3, :cond_2

    .line 90
    .line 91
    :try_start_0
    new-instance v3, Lorg/json/JSONObject;

    .line 92
    .line 93
    invoke-direct {v3, v2}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 94
    .line 95
    .line 96
    invoke-virtual {v3}, Lorg/json/JSONObject;->keys()Ljava/util/Iterator;

    .line 97
    .line 98
    .line 99
    move-result-object v2

    .line 100
    :cond_1
    :goto_0
    invoke-interface {v2}, Ljava/util/Iterator;->hasNext()Z

    .line 101
    .line 102
    .line 103
    move-result v4

    .line 104
    if-eqz v4, :cond_2

    .line 105
    .line 106
    invoke-interface {v2}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    .line 107
    .line 108
    .line 109
    move-result-object v4

    .line 110
    check-cast v4, Ljava/lang/String;

    .line 111
    .line 112
    invoke-virtual {v3, v4, p1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 113
    .line 114
    .line 115
    move-result-object v5

    .line 116
    invoke-virtual {v4}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 117
    .line 118
    .line 119
    move-result-object v7

    .line 120
    invoke-virtual {v7}, Ljava/lang/String;->isEmpty()Z

    .line 121
    .line 122
    .line 123
    move-result v7

    .line 124
    if-nez v7, :cond_1

    .line 125
    .line 126
    invoke-virtual {v5}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 127
    .line 128
    .line 129
    move-result-object v7

    .line 130
    invoke-virtual {v7}, Ljava/lang/String;->isEmpty()Z

    .line 131
    .line 132
    .line 133
    move-result v7

    .line 134
    if-nez v7, :cond_1

    .line 135
    .line 136
    invoke-virtual {v8, v4, v5}, Ljava/util/AbstractMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 137
    .line 138
    .line 139
    goto :goto_0

    .line 140
    :catch_0
    :cond_2
    new-instance v2, Lx/i9;

    .line 141
    .line 142
    const-string v3, "tv-snapshot"

    .line 143
    .line 144
    if-nez p3, :cond_3

    .line 145
    .line 146
    const-string p3, "Canal"

    .line 147
    .line 148
    :cond_3
    move-object v4, p3

    .line 149
    if-nez p2, :cond_4

    .line 150
    .line 151
    const-string p2, "auto"

    .line 152
    .line 153
    :cond_4
    move-object v5, p2

    .line 154
    if-nez v0, :cond_5

    .line 155
    .line 156
    move-object v7, p1

    .line 157
    goto :goto_1

    .line 158
    :cond_5
    move-object v7, v0

    .line 159
    :goto_1
    invoke-direct/range {v2 .. v8}, Lx/i9;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/util/LinkedHashMap;)V

    .line 160
    .line 161
    .line 162
    iput v1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 163
    .line 164
    const-wide/16 p1, 0x0

    .line 165
    .line 166
    invoke-virtual {p0, v2, p1, p2}, Lcom/cochi/client/PlayerActivity;->K(Lx/i9;J)V

    .line 167
    .line 168
    .line 169
    return-void

    .line 170
    :cond_6
    :goto_2
    const-string p1, "Canal temporalmente no disponible"

    .line 171
    .line 172
    invoke-static {p0, p1, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    .line 173
    .line 174
    .line 175
    move-result-object p1

    .line 176
    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    .line 177
    .line 178
    .line 179
    return-void

    .line 180
    :cond_7
    if-gez p1, :cond_8

    .line 181
    .line 182
    add-int/lit8 p1, v0, -0x1

    .line 183
    .line 184
    :cond_8
    if-lt p1, v0, :cond_9

    .line 185
    .line 186
    move p1, v1

    .line 187
    :cond_9
    iput p1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 188
    .line 189
    iput-boolean v1, p0, Lcom/cochi/client/PlayerActivity;->r0:Z

    .line 190
    .line 191
    invoke-static {p1}, Lx/o9;->a(I)Lx/i9;

    .line 192
    .line 193
    .line 194
    move-result-object p1

    .line 195
    if-nez p1, :cond_a

    .line 196
    .line 197
    return-void

    .line 198
    :cond_a
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 199
    .line 200
    sget-object v1, Lx/P8;->k:Lx/P8;

    .line 201
    .line 202
    const-wide/16 v2, -0x1

    .line 203
    .line 204
    const/4 v4, 0x0

    .line 205
    if-ne v0, v1, :cond_10

    .line 206
    .line 207
    iget-object v0, p1, Lx/i9;->a:Ljava/lang/String;

    .line 208
    .line 209
    sget-object v1, Lx/lF;->a:Ljava/util/Map;

    .line 210
    .line 211
    const-class v1, Lx/lF;

    .line 212
    .line 213
    monitor-enter v1

    .line 214
    if-nez v0, :cond_b

    .line 215
    .line 216
    :try_start_1
    new-instance v0, Lx/hF;

    .line 217
    .line 218
    invoke-direct {v0, v4, v4, v2, v3}, Lx/hF;-><init>(Lx/W6;Lx/W6;J)V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    .line 219
    .line 220
    .line 221
    monitor-exit v1

    .line 222
    goto :goto_4

    .line 223
    :catchall_0
    move-exception v0

    .line 224
    move-object p1, v0

    .line 225
    goto :goto_3

    .line 226
    :cond_b
    :try_start_2
    sget-object v5, Lx/lF;->a:Ljava/util/Map;

    .line 227
    .line 228
    invoke-interface {v5}, Ljava/util/Map;->values()Ljava/util/Collection;

    .line 229
    .line 230
    .line 231
    move-result-object v5

    .line 232
    invoke-interface {v5}, Ljava/util/Collection;->iterator()Ljava/util/Iterator;

    .line 233
    .line 234
    .line 235
    move-result-object v5

    .line 236
    :cond_c
    invoke-interface {v5}, Ljava/util/Iterator;->hasNext()Z

    .line 237
    .line 238
    .line 239
    move-result v6

    .line 240
    if-eqz v6, :cond_f

    .line 241
    .line 242
    invoke-interface {v5}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    .line 243
    .line 244
    .line 245
    move-result-object v6

    .line 246
    check-cast v6, Lx/kF;

    .line 247
    .line 248
    iget-object v7, v6, Lx/kF;->j:Ljava/util/List;

    .line 249
    .line 250
    invoke-interface {v7}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    .line 251
    .line 252
    .line 253
    move-result-object v7

    .line 254
    :cond_d
    invoke-interface {v7}, Ljava/util/Iterator;->hasNext()Z

    .line 255
    .line 256
    .line 257
    move-result v8

    .line 258
    if-eqz v8, :cond_c

    .line 259
    .line 260
    invoke-interface {v7}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    .line 261
    .line 262
    .line 263
    move-result-object v8

    .line 264
    check-cast v8, Lx/iF;

    .line 265
    .line 266
    iget-object v9, v8, Lx/iF;->c:Ljava/util/List;

    .line 267
    .line 268
    invoke-interface {v9}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    .line 269
    .line 270
    .line 271
    move-result-object v9

    .line 272
    :cond_e
    invoke-interface {v9}, Ljava/util/Iterator;->hasNext()Z

    .line 273
    .line 274
    .line 275
    move-result v10

    .line 276
    if-eqz v10, :cond_d

    .line 277
    .line 278
    invoke-interface {v9}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    .line 279
    .line 280
    .line 281
    move-result-object v10

    .line 282
    check-cast v10, Lx/i9;

    .line 283
    .line 284
    iget-object v11, v10, Lx/i9;->a:Ljava/lang/String;

    .line 285
    .line 286
    invoke-virtual {v0, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    .line 287
    .line 288
    .line 289
    move-result v11

    .line 290
    if-eqz v11, :cond_e

    .line 291
    .line 292
    iget-object v0, v6, Lx/kF;->k:Lx/mq;

    .line 293
    .line 294
    iget v2, v8, Lx/iF;->a:I

    .line 295
    .line 296
    iget v3, v10, Lx/i9;->b:I

    .line 297
    .line 298
    invoke-virtual {v0, v2, v3}, Lx/mq;->K(II)Lx/hF;

    .line 299
    .line 300
    .line 301
    move-result-object v0
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_0

    .line 302
    monitor-exit v1

    .line 303
    goto :goto_4

    .line 304
    :cond_f
    :try_start_3
    new-instance v0, Lx/hF;

    .line 305
    .line 306
    invoke-direct {v0, v4, v4, v2, v3}, Lx/hF;-><init>(Lx/W6;Lx/W6;J)V
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_0

    .line 307
    .line 308
    .line 309
    monitor-exit v1

    .line 310
    goto :goto_4

    .line 311
    :goto_3
    :try_start_4
    monitor-exit v1
    :try_end_4
    .catchall {:try_start_4 .. :try_end_4} :catchall_0

    .line 312
    throw p1

    .line 313
    :cond_10
    new-instance v0, Lx/hF;

    .line 314
    .line 315
    invoke-direct {v0, v4, v4, v2, v3}, Lx/hF;-><init>(Lx/W6;Lx/W6;J)V

    .line 316
    .line 317
    .line 318
    :goto_4
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->T:Lx/hF;

    .line 319
    .line 320
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->E()V

    .line 321
    .line 322
    .line 323
    invoke-virtual {p0, p1, p2, p3}, Lcom/cochi/client/PlayerActivity;->K(Lx/i9;J)V

    .line 324
    .line 325
    .line 326
    return-void
.end method

.method public final N(Lx/i9;J)V
    .locals 3

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 2
    .line 3
    const/16 v1, 0x8

    .line 4
    .line 5
    invoke-virtual {v0, v1}, Landroid/view/View;->setVisibility(I)V

    .line 6
    .line 7
    .line 8
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 9
    .line 10
    const/4 v1, 0x0

    .line 11
    invoke-virtual {v0, v1}, Landroidx/media3/ui/PlayerView;->setVisibility(I)V

    .line 12
    .line 13
    .line 14
    if-nez p1, :cond_0

    .line 15
    .line 16
    const-string v0, ""

    .line 17
    .line 18
    goto :goto_0

    .line 19
    :cond_0
    iget-object v0, p1, Lx/i9;->e:Ljava/lang/String;

    .line 20
    .line 21
    :goto_0
    invoke-virtual {p0, p1, v0}, Lcom/cochi/client/PlayerActivity;->x(Lx/i9;Ljava/lang/String;)Lx/Je;

    .line 22
    .line 23
    .line 24
    move-result-object v0

    .line 25
    new-instance v1, Lx/ef;

    .line 26
    .line 27
    invoke-direct {v1, v0}, Lx/ef;-><init>(Lx/Je;)V

    .line 28
    .line 29
    .line 30
    new-instance v0, Lx/zw;

    .line 31
    .line 32
    iget-boolean v2, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 33
    .line 34
    if-eqz v2, :cond_1

    .line 35
    .line 36
    const/4 v2, 0x1

    .line 37
    goto :goto_1

    .line 38
    :cond_1
    const/4 v2, 0x4

    .line 39
    :goto_1
    invoke-direct {v0, v2}, Lx/zw;-><init>(I)V

    .line 40
    .line 41
    .line 42
    invoke-virtual {v1, v0}, Lx/ef;->i(Lx/zw;)V

    .line 43
    .line 44
    .line 45
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 46
    .line 47
    if-nez v0, :cond_2

    .line 48
    .line 49
    invoke-virtual {p0, v1}, Lcom/cochi/client/PlayerActivity;->z(Lx/ef;)Lx/nj;

    .line 50
    .line 51
    .line 52
    move-result-object v0

    .line 53
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 54
    .line 55
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->v()V

    .line 56
    .line 57
    .line 58
    goto :goto_2

    .line 59
    :cond_2
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 60
    .line 61
    invoke-virtual {v2, v0}, Landroidx/media3/ui/PlayerView;->setPlayer(Lx/cy;)V

    .line 62
    .line 63
    .line 64
    :goto_2
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 65
    .line 66
    iget-object v2, p1, Lx/i9;->e:Ljava/lang/String;

    .line 67
    .line 68
    invoke-static {p1, v2}, Lcom/cochi/client/PlayerActivity;->y(Lx/i9;Ljava/lang/String;)Lx/Nt;

    .line 69
    .line 70
    .line 71
    move-result-object p1

    .line 72
    invoke-virtual {v1, p1}, Lx/ef;->d(Lx/Nt;)Lx/Y5;

    .line 73
    .line 74
    .line 75
    move-result-object p1

    .line 76
    invoke-virtual {v0}, Lx/nj;->c0()V

    .line 77
    .line 78
    .line 79
    invoke-static {p1}, Ljava/util/Collections;->singletonList(Ljava/lang/Object;)Ljava/util/List;

    .line 80
    .line 81
    .line 82
    move-result-object p1

    .line 83
    invoke-virtual {v0}, Lx/nj;->c0()V

    .line 84
    .line 85
    .line 86
    invoke-virtual {v0, p1}, Lx/nj;->S(Ljava/util/List;)V

    .line 87
    .line 88
    .line 89
    const-wide/16 v0, 0x0

    .line 90
    .line 91
    cmp-long p1, p2, v0

    .line 92
    .line 93
    if-lez p1, :cond_3

    .line 94
    .line 95
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 96
    .line 97
    const/4 v0, 0x5

    .line 98
    invoke-virtual {p1, v0, p2, p3}, Lx/Z5;->k(IJ)V

    .line 99
    .line 100
    .line 101
    :cond_3
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 102
    .line 103
    invoke-virtual {p1}, Lx/nj;->N()V

    .line 104
    .line 105
    .line 106
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 107
    .line 108
    invoke-virtual {p1}, Lx/Z5;->i()V

    .line 109
    .line 110
    .line 111
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->u()V

    .line 112
    .line 113
    .line 114
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->t()V

    .line 115
    .line 116
    .line 117
    return-void
.end method

.method public final O(Lx/i9;J)V
    .locals 18

    .line 1
    move-object/from16 v1, p0

    .line 2
    .line 3
    move-object/from16 v0, p1

    .line 4
    .line 5
    move-wide/from16 v2, p2

    .line 6
    .line 7
    iget-object v4, v1, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 8
    .line 9
    const/16 v5, 0x8

    .line 10
    .line 11
    invoke-virtual {v4, v5}, Landroid/view/View;->setVisibility(I)V

    .line 12
    .line 13
    .line 14
    iget-object v4, v0, Lx/i9;->e:Ljava/lang/String;

    .line 15
    .line 16
    iget-boolean v5, v0, Lx/i9;->m:Z

    .line 17
    .line 18
    if-eqz v5, :cond_0

    .line 19
    .line 20
    :try_start_0
    iget-object v5, v1, Lcom/cochi/client/PlayerActivity;->W:Ljava/util/concurrent/ExecutorService;

    .line 21
    .line 22
    new-instance v6, Lx/oy;

    .line 23
    .line 24
    invoke-direct {v6, v1, v0}, Lx/oy;-><init>(Lcom/cochi/client/PlayerActivity;Lx/i9;)V

    .line 25
    .line 26
    .line 27
    invoke-interface {v5, v6}, Ljava/util/concurrent/ExecutorService;->submit(Ljava/util/concurrent/Callable;)Ljava/util/concurrent/Future;

    .line 28
    .line 29
    .line 30
    move-result-object v5

    .line 31
    sget-object v6, Ljava/util/concurrent/TimeUnit;->SECONDS:Ljava/util/concurrent/TimeUnit;

    .line 32
    .line 33
    const-wide/16 v7, 0x14

    .line 34
    .line 35
    invoke-interface {v5, v7, v8, v6}, Ljava/util/concurrent/Future;->get(JLjava/util/concurrent/TimeUnit;)Ljava/lang/Object;

    .line 36
    .line 37
    .line 38
    move-result-object v5

    .line 39
    check-cast v5, Ljava/lang/String;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 40
    .line 41
    goto :goto_0

    .line 42
    :catch_0
    const/4 v5, 0x0

    .line 43
    :goto_0
    if-eqz v5, :cond_0

    .line 44
    .line 45
    move-object v4, v5

    .line 46
    :cond_0
    iget-object v5, v1, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 47
    .line 48
    const/4 v6, 0x0

    .line 49
    invoke-virtual {v5, v6}, Landroidx/media3/ui/PlayerView;->setVisibility(I)V

    .line 50
    .line 51
    .line 52
    const/4 v5, 0x1

    .line 53
    :try_start_1
    iget-object v7, v0, Lx/i9;->f:Ljava/lang/String;

    .line 54
    .line 55
    invoke-static {v7}, Lcom/cochi/client/PlayerActivity;->J(Ljava/lang/String;)Ljava/util/ArrayList;

    .line 56
    .line 57
    .line 58
    move-result-object v7

    .line 59
    new-instance v8, Ljava/util/ArrayList;

    .line 60
    .line 61
    invoke-direct {v8, v7}, Ljava/util/ArrayList;-><init>(Ljava/util/Collection;)V

    .line 62
    .line 63
    .line 64
    new-instance v7, Lx/mq;

    .line 65
    .line 66
    invoke-static {v8}, Lcom/cochi/client/PlayerActivity;->w(Ljava/util/ArrayList;)Ljava/lang/String;

    .line 67
    .line 68
    .line 69
    move-result-object v9

    .line 70
    sget-object v10, Ljava/nio/charset/StandardCharsets;->UTF_8:Ljava/nio/charset/Charset;

    .line 71
    .line 72
    invoke-virtual {v9, v10}, Ljava/lang/String;->getBytes(Ljava/nio/charset/Charset;)[B

    .line 73
    .line 74
    .line 75
    move-result-object v9

    .line 76
    invoke-direct {v7, v9}, Lx/mq;-><init>([B)V

    .line 77
    .line 78
    .line 79
    new-instance v12, Lx/Wk;

    .line 80
    .line 81
    invoke-direct {v12, v1, v8, v7}, Lx/Wk;-><init>(Lcom/cochi/client/PlayerActivity;Ljava/util/ArrayList;Lx/mq;)V

    .line 82
    .line 83
    .line 84
    new-instance v13, Ljava/util/HashMap;

    .line 85
    .line 86
    invoke-direct {v13}, Ljava/util/HashMap;-><init>()V

    .line 87
    .line 88
    .line 89
    new-array v15, v6, [I

    .line 90
    .line 91
    new-instance v6, Lx/zw;

    .line 92
    .line 93
    const/4 v7, -0x1

    .line 94
    invoke-direct {v6, v7}, Lx/zw;-><init>(I)V

    .line 95
    .line 96
    .line 97
    sget-object v11, Lx/u7;->c:Ljava/util/UUID;

    .line 98
    .line 99
    invoke-virtual {v11}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 100
    .line 101
    .line 102
    new-instance v10, Lx/ue;

    .line 103
    .line 104
    const/16 v16, 0x1

    .line 105
    .line 106
    const/4 v14, 0x1

    .line 107
    move-object/from16 v17, v6

    .line 108
    .line 109
    invoke-direct/range {v10 .. v17}, Lx/ue;-><init>(Ljava/util/UUID;Lx/Et;Ljava/util/HashMap;Z[IZLx/zw;)V

    .line 110
    .line 111
    .line 112
    new-instance v6, Lx/ef;

    .line 113
    .line 114
    invoke-virtual {v1, v0, v4}, Lcom/cochi/client/PlayerActivity;->x(Lx/i9;Ljava/lang/String;)Lx/Je;

    .line 115
    .line 116
    .line 117
    move-result-object v7

    .line 118
    invoke-direct {v6, v7}, Lx/ef;-><init>(Lx/Je;)V

    .line 119
    .line 120
    .line 121
    new-instance v7, Lx/zw;

    .line 122
    .line 123
    iget-boolean v8, v1, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 124
    .line 125
    if-eqz v8, :cond_1

    .line 126
    .line 127
    move v8, v5

    .line 128
    goto :goto_1

    .line 129
    :cond_1
    const/4 v8, 0x4

    .line 130
    :goto_1
    invoke-direct {v7, v8}, Lx/zw;-><init>(I)V

    .line 131
    .line 132
    .line 133
    invoke-virtual {v6, v7}, Lx/ef;->i(Lx/zw;)V

    .line 134
    .line 135
    .line 136
    new-instance v7, Lx/i5;

    .line 137
    .line 138
    const/16 v8, 0x17

    .line 139
    .line 140
    invoke-direct {v7, v8, v10}, Lx/i5;-><init>(ILjava/lang/Object;)V

    .line 141
    .line 142
    .line 143
    invoke-virtual {v6, v7}, Lx/ef;->h(Lx/Yg;)V

    .line 144
    .line 145
    .line 146
    iget-object v7, v1, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 147
    .line 148
    if-nez v7, :cond_2

    .line 149
    .line 150
    invoke-virtual {v1, v6}, Lcom/cochi/client/PlayerActivity;->z(Lx/ef;)Lx/nj;

    .line 151
    .line 152
    .line 153
    move-result-object v7

    .line 154
    iput-object v7, v1, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 155
    .line 156
    invoke-virtual {v1}, Lcom/cochi/client/PlayerActivity;->v()V

    .line 157
    .line 158
    .line 159
    goto :goto_2

    .line 160
    :catch_1
    move-exception v0

    .line 161
    goto :goto_3

    .line 162
    :cond_2
    iget-object v8, v1, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 163
    .line 164
    invoke-virtual {v8, v7}, Landroidx/media3/ui/PlayerView;->setPlayer(Lx/cy;)V

    .line 165
    .line 166
    .line 167
    :goto_2
    iget-object v7, v1, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 168
    .line 169
    invoke-static {v0, v4}, Lcom/cochi/client/PlayerActivity;->y(Lx/i9;Ljava/lang/String;)Lx/Nt;

    .line 170
    .line 171
    .line 172
    move-result-object v0

    .line 173
    invoke-virtual {v6, v0}, Lx/ef;->d(Lx/Nt;)Lx/Y5;

    .line 174
    .line 175
    .line 176
    move-result-object v0

    .line 177
    invoke-virtual {v7}, Lx/nj;->c0()V

    .line 178
    .line 179
    .line 180
    invoke-static {v0}, Ljava/util/Collections;->singletonList(Ljava/lang/Object;)Ljava/util/List;

    .line 181
    .line 182
    .line 183
    move-result-object v0

    .line 184
    invoke-virtual {v7}, Lx/nj;->c0()V

    .line 185
    .line 186
    .line 187
    invoke-virtual {v7, v0}, Lx/nj;->S(Ljava/util/List;)V

    .line 188
    .line 189
    .line 190
    const-wide/16 v6, 0x0

    .line 191
    .line 192
    cmp-long v0, v2, v6

    .line 193
    .line 194
    if-lez v0, :cond_3

    .line 195
    .line 196
    iget-object v0, v1, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 197
    .line 198
    const/4 v4, 0x5

    .line 199
    invoke-virtual {v0, v4, v2, v3}, Lx/Z5;->k(IJ)V

    .line 200
    .line 201
    .line 202
    :cond_3
    iget-object v0, v1, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 203
    .line 204
    invoke-virtual {v0}, Lx/nj;->N()V

    .line 205
    .line 206
    .line 207
    iget-object v0, v1, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 208
    .line 209
    invoke-virtual {v0}, Lx/Z5;->i()V

    .line 210
    .line 211
    .line 212
    invoke-virtual {v1}, Lcom/cochi/client/PlayerActivity;->u()V

    .line 213
    .line 214
    .line 215
    invoke-virtual {v1}, Lcom/cochi/client/PlayerActivity;->t()V
    :try_end_1
    .catch Ljava/lang/IllegalArgumentException; {:try_start_1 .. :try_end_1} :catch_1

    .line 216
    .line 217
    .line 218
    goto :goto_4

    .line 219
    :goto_3
    invoke-virtual {v0}, Ljava/lang/Throwable;->getMessage()Ljava/lang/String;

    .line 220
    .line 221
    .line 222
    move-result-object v0

    .line 223
    invoke-static {v1, v0, v5}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    .line 224
    .line 225
    .line 226
    move-result-object v0

    .line 227
    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    .line 228
    .line 229
    .line 230
    :goto_4
    return-void
.end method

.method public final P(I)V
    .locals 3

    .line 1
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 2
    .line 3
    if-eqz v0, :cond_6

    .line 4
    .line 5
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 6
    .line 7
    if-eqz v0, :cond_0

    .line 8
    .line 9
    goto :goto_3

    .line 10
    :cond_0
    iget v0, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 11
    .line 12
    add-int/2addr v0, p1

    .line 13
    if-ltz v0, :cond_2

    .line 14
    .line 15
    invoke-static {}, Lx/o9;->d()I

    .line 16
    .line 17
    .line 18
    move-result v1

    .line 19
    if-lt v0, v1, :cond_1

    .line 20
    .line 21
    goto :goto_0

    .line 22
    :cond_1
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->S()V

    .line 23
    .line 24
    .line 25
    const-wide/16 v1, 0x0

    .line 26
    .line 27
    invoke-virtual {p0, v0, v1, v2}, Lcom/cochi/client/PlayerActivity;->L(IJ)V

    .line 28
    .line 29
    .line 30
    new-instance p1, Lx/dy;

    .line 31
    .line 32
    const/4 v0, 0x1

    .line 33
    invoke-direct {p1, p0, v0}, Lx/dy;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 34
    .line 35
    .line 36
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 37
    .line 38
    invoke-virtual {v0, p1}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 39
    .line 40
    .line 41
    return-void

    .line 42
    :cond_2
    :goto_0
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 43
    .line 44
    sget-object v1, Lx/P8;->k:Lx/P8;

    .line 45
    .line 46
    if-ne v0, v1, :cond_3

    .line 47
    .line 48
    const-string v0, "cap\u00edtulo"

    .line 49
    .line 50
    goto :goto_1

    .line 51
    :cond_3
    sget-object v1, Lx/P8;->j:Lx/P8;

    .line 52
    .line 53
    if-ne v0, v1, :cond_4

    .line 54
    .line 55
    const-string v0, "pel\u00edcula"

    .line 56
    .line 57
    goto :goto_1

    .line 58
    :cond_4
    const-string v0, "contenido"

    .line 59
    .line 60
    :goto_1
    const-string v1, "No hay "

    .line 61
    .line 62
    if-gez p1, :cond_5

    .line 63
    .line 64
    const-string p1, " anterior"

    .line 65
    .line 66
    invoke-static {v1, v0, p1}, Lx/jG;->l(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 67
    .line 68
    .line 69
    move-result-object p1

    .line 70
    goto :goto_2

    .line 71
    :cond_5
    const-string p1, " siguiente"

    .line 72
    .line 73
    invoke-static {v1, v0, p1}, Lx/jG;->l(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 74
    .line 75
    .line 76
    move-result-object p1

    .line 77
    :goto_2
    const/4 v0, 0x0

    .line 78
    invoke-static {p0, p1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    .line 79
    .line 80
    .line 81
    move-result-object p1

    .line 82
    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    .line 83
    .line 84
    .line 85
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->F()V

    .line 86
    .line 87
    .line 88
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->a0()V

    .line 89
    .line 90
    .line 91
    :cond_6
    :goto_3
    return-void
.end method

.method public final Q()Z
    .locals 2

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 2
    .line 3
    if-eqz v0, :cond_1

    .line 4
    .line 5
    invoke-virtual {p0}, Landroid/app/Activity;->isFinishing()Z

    .line 6
    .line 7
    .line 8
    move-result v0

    .line 9
    if-nez v0, :cond_1

    .line 10
    .line 11
    invoke-virtual {p0}, Landroid/app/Activity;->isDestroyed()Z

    .line 12
    .line 13
    .line 14
    move-result v0

    .line 15
    if-eqz v0, :cond_0

    .line 16
    .line 17
    goto :goto_0

    .line 18
    :cond_0
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 19
    .line 20
    invoke-virtual {v0}, Lx/nj;->E()I

    .line 21
    .line 22
    .line 23
    move-result v0

    .line 24
    const/4 v1, 0x3

    .line 25
    if-eq v0, v1, :cond_1

    .line 26
    .line 27
    const/4 v1, 0x4

    .line 28
    if-eq v0, v1, :cond_1

    .line 29
    .line 30
    const/4 v0, 0x1

    .line 31
    return v0

    .line 32
    :cond_1
    :goto_0
    const/4 v0, 0x0

    .line 33
    return v0
.end method

.method public final R()V
    .locals 3

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->V:Lx/dy;

    .line 2
    .line 3
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 4
    .line 5
    invoke-virtual {v1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 6
    .line 7
    .line 8
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->v0:Lx/ry;

    .line 9
    .line 10
    invoke-virtual {v1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 11
    .line 12
    .line 13
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->w0:Lx/ry;

    .line 14
    .line 15
    invoke-virtual {v1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 16
    .line 17
    .line 18
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->x0:Lx/ry;

    .line 19
    .line 20
    invoke-virtual {v1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 21
    .line 22
    .line 23
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->y0:Lx/ry;

    .line 24
    .line 25
    invoke-virtual {v1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 26
    .line 27
    .line 28
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->n0:Lx/ry;

    .line 29
    .line 30
    invoke-virtual {v1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 31
    .line 32
    .line 33
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->A()V

    .line 34
    .line 35
    .line 36
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->B()V

    .line 37
    .line 38
    .line 39
    iget v0, p0, Lcom/cochi/client/PlayerActivity;->f0:I

    .line 40
    .line 41
    add-int/lit8 v0, v0, 0x1

    .line 42
    .line 43
    iput v0, p0, Lcom/cochi/client/PlayerActivity;->f0:I

    .line 44
    .line 45
    const/4 v0, 0x0

    .line 46
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->g0:Lx/i9;

    .line 47
    .line 48
    const/4 v1, 0x0

    .line 49
    iput-boolean v1, p0, Lcom/cochi/client/PlayerActivity;->j0:Z

    .line 50
    .line 51
    iput-boolean v1, p0, Lcom/cochi/client/PlayerActivity;->k0:Z

    .line 52
    .line 53
    iput-boolean v1, p0, Lcom/cochi/client/PlayerActivity;->l0:Z

    .line 54
    .line 55
    iput v1, p0, Lcom/cochi/client/PlayerActivity;->d0:I

    .line 56
    .line 57
    const-wide/16 v1, 0x0

    .line 58
    .line 59
    iput-wide v1, p0, Lcom/cochi/client/PlayerActivity;->e0:J

    .line 60
    .line 61
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->P:Landroid/view/View;

    .line 62
    .line 63
    const/16 v2, 0x8

    .line 64
    .line 65
    if-eqz v1, :cond_0

    .line 66
    .line 67
    invoke-virtual {v1, v2}, Landroid/view/View;->setVisibility(I)V

    .line 68
    .line 69
    .line 70
    :cond_0
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->H:Landroid/widget/ProgressBar;

    .line 71
    .line 72
    invoke-virtual {v1, v2}, Landroid/view/View;->setVisibility(I)V

    .line 73
    .line 74
    .line 75
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 76
    .line 77
    if-eqz v1, :cond_1

    .line 78
    .line 79
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 80
    .line 81
    invoke-virtual {v1, v0}, Landroidx/media3/ui/PlayerView;->setPlayer(Lx/cy;)V

    .line 82
    .line 83
    .line 84
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 85
    .line 86
    invoke-virtual {v1}, Lx/nj;->O()V

    .line 87
    .line 88
    .line 89
    iput-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 90
    .line 91
    :cond_1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 92
    .line 93
    if-eqz v0, :cond_2

    .line 94
    .line 95
    invoke-virtual {v0}, Landroid/webkit/WebView;->stopLoading()V

    .line 96
    .line 97
    .line 98
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 99
    .line 100
    const-string v1, "about:blank"

    .line 101
    .line 102
    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V

    .line 103
    .line 104
    .line 105
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 106
    .line 107
    invoke-virtual {v0}, Landroid/webkit/WebView;->clearHistory()V

    .line 108
    .line 109
    .line 110
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 111
    .line 112
    invoke-virtual {v0}, Landroid/webkit/WebView;->onPause()V

    .line 113
    .line 114
    .line 115
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 116
    .line 117
    invoke-virtual {v0, v2}, Landroid/view/View;->setVisibility(I)V

    .line 118
    .line 119
    .line 120
    :cond_2
    return-void
.end method

.method public final S()V
    .locals 18

    .line 1
    move-object/from16 v0, p0

    .line 2
    .line 3
    invoke-virtual {v0}, Lcom/cochi/client/PlayerActivity;->U()Z

    .line 4
    .line 5
    .line 6
    move-result v1

    .line 7
    if-eqz v1, :cond_11

    .line 8
    .line 9
    iget-object v1, v0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 10
    .line 11
    if-nez v1, :cond_0

    .line 12
    .line 13
    goto/16 :goto_5

    .line 14
    .line 15
    :cond_0
    iget v1, v0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 16
    .line 17
    invoke-static {v1}, Lx/o9;->a(I)Lx/i9;

    .line 18
    .line 19
    .line 20
    move-result-object v1

    .line 21
    if-nez v1, :cond_1

    .line 22
    .line 23
    goto/16 :goto_5

    .line 24
    .line 25
    :cond_1
    iget-object v2, v0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 26
    .line 27
    invoke-virtual {v2}, Lx/nj;->C()J

    .line 28
    .line 29
    .line 30
    move-result-wide v2

    .line 31
    iget-object v4, v0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 32
    .line 33
    invoke-virtual {v4}, Lx/nj;->x()J

    .line 34
    .line 35
    .line 36
    move-result-wide v4

    .line 37
    const-wide/16 v6, 0x0

    .line 38
    .line 39
    cmp-long v6, v2, v6

    .line 40
    .line 41
    if-lez v6, :cond_11

    .line 42
    .line 43
    const-wide v7, -0x7fffffffffffffffL    # -4.9E-324

    .line 44
    .line 45
    .line 46
    .line 47
    .line 48
    cmp-long v7, v2, v7

    .line 49
    .line 50
    if-nez v7, :cond_2

    .line 51
    .line 52
    goto/16 :goto_5

    .line 53
    .line 54
    :cond_2
    iget-object v7, v0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 55
    .line 56
    if-eqz v7, :cond_11

    .line 57
    .line 58
    iget-object v8, v1, Lx/i9;->a:Ljava/lang/String;

    .line 59
    .line 60
    sget-object v9, Lx/P8;->j:Lx/P8;

    .line 61
    .line 62
    sget-object v10, Lx/P8;->k:Lx/P8;

    .line 63
    .line 64
    if-eq v7, v9, :cond_3

    .line 65
    .line 66
    if-eq v7, v10, :cond_3

    .line 67
    .line 68
    goto/16 :goto_5

    .line 69
    .line 70
    :cond_3
    if-lez v6, :cond_11

    .line 71
    .line 72
    const-wide/16 v11, 0x2710

    .line 73
    .line 74
    cmp-long v6, v4, v11

    .line 75
    .line 76
    if-gez v6, :cond_4

    .line 77
    .line 78
    goto/16 :goto_5

    .line 79
    .line 80
    :cond_4
    if-ne v7, v10, :cond_b

    .line 81
    .line 82
    invoke-static {v8}, Lx/lF;->b(Ljava/lang/String;)Lx/kF;

    .line 83
    .line 84
    .line 85
    move-result-object v11

    .line 86
    if-nez v11, :cond_5

    .line 87
    .line 88
    goto :goto_2

    .line 89
    :cond_5
    invoke-static {v0}, Lx/E5;->T(Landroid/content/Context;)Landroid/content/SharedPreferences;

    .line 90
    .line 91
    .line 92
    move-result-object v12

    .line 93
    invoke-virtual {v11}, Lx/kF;->a()Ljava/util/ArrayList;

    .line 94
    .line 95
    .line 96
    move-result-object v11

    .line 97
    invoke-virtual {v11}, Ljava/util/ArrayList;->size()I

    .line 98
    .line 99
    .line 100
    move-result v13

    .line 101
    const/4 v14, 0x0

    .line 102
    const/4 v15, 0x0

    .line 103
    :goto_0
    if-ge v15, v13, :cond_a

    .line 104
    .line 105
    invoke-virtual {v11, v15}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    .line 106
    .line 107
    .line 108
    move-result-object v16

    .line 109
    add-int/lit8 v15, v15, 0x1

    .line 110
    .line 111
    move-object/from16 v6, v16

    .line 112
    .line 113
    check-cast v6, Lx/i9;

    .line 114
    .line 115
    if-eqz v6, :cond_9

    .line 116
    .line 117
    iget-object v6, v6, Lx/i9;->a:Ljava/lang/String;

    .line 118
    .line 119
    move-object/from16 v16, v11

    .line 120
    .line 121
    invoke-static {v6}, Lx/E5;->a0(Ljava/lang/String;)Ljava/lang/String;

    .line 122
    .line 123
    .line 124
    move-result-object v11

    .line 125
    move/from16 v17, v13

    .line 126
    .line 127
    invoke-static {v8}, Lx/E5;->a0(Ljava/lang/String;)Ljava/lang/String;

    .line 128
    .line 129
    .line 130
    move-result-object v13

    .line 131
    invoke-virtual {v11, v13}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    .line 132
    .line 133
    .line 134
    move-result v11

    .line 135
    if-eqz v11, :cond_6

    .line 136
    .line 137
    goto :goto_1

    .line 138
    :cond_6
    invoke-static {v10, v6}, Lx/E5;->C(Lx/P8;Ljava/lang/String;)Ljava/lang/String;

    .line 139
    .line 140
    .line 141
    move-result-object v6

    .line 142
    invoke-interface {v12, v6}, Landroid/content/SharedPreferences;->contains(Ljava/lang/String;)Z

    .line 143
    .line 144
    .line 145
    move-result v11

    .line 146
    if-eqz v11, :cond_8

    .line 147
    .line 148
    if-nez v14, :cond_7

    .line 149
    .line 150
    invoke-interface {v12}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    .line 151
    .line 152
    .line 153
    move-result-object v14

    .line 154
    :cond_7
    invoke-interface {v14, v6}, Landroid/content/SharedPreferences$Editor;->remove(Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    .line 155
    .line 156
    .line 157
    :cond_8
    :goto_1
    move-object/from16 v11, v16

    .line 158
    .line 159
    move/from16 v13, v17

    .line 160
    .line 161
    goto :goto_0

    .line 162
    :cond_9
    move-object/from16 v16, v11

    .line 163
    .line 164
    move/from16 v17, v13

    .line 165
    .line 166
    goto :goto_1

    .line 167
    :cond_a
    if-eqz v14, :cond_b

    .line 168
    .line 169
    invoke-interface {v14}, Landroid/content/SharedPreferences$Editor;->apply()V

    .line 170
    .line 171
    .line 172
    :cond_b
    :goto_2
    long-to-double v10, v4

    .line 173
    long-to-double v12, v2

    .line 174
    div-double/2addr v10, v12

    .line 175
    const-wide v12, 0x3fee666666666666L    # 0.95

    .line 176
    .line 177
    .line 178
    .line 179
    .line 180
    cmpl-double v6, v10, v12

    .line 181
    .line 182
    if-ltz v6, :cond_c

    .line 183
    .line 184
    const/4 v6, 0x1

    .line 185
    goto :goto_3

    .line 186
    :cond_c
    const/4 v6, 0x0

    .line 187
    :goto_3
    if-eqz v6, :cond_d

    .line 188
    .line 189
    invoke-static {v0, v7, v8}, Lx/E5;->G(Landroid/content/Context;Lx/P8;Ljava/lang/String;)V

    .line 190
    .line 191
    .line 192
    if-ne v7, v9, :cond_f

    .line 193
    .line 194
    invoke-static {v0, v7, v8}, Lx/E5;->Y(Landroid/content/Context;Lx/P8;Ljava/lang/String;)V

    .line 195
    .line 196
    .line 197
    return-void

    .line 198
    :cond_d
    if-nez v8, :cond_e

    .line 199
    .line 200
    goto :goto_4

    .line 201
    :cond_e
    invoke-static {v0}, Lx/E5;->T(Landroid/content/Context;)Landroid/content/SharedPreferences;

    .line 202
    .line 203
    .line 204
    move-result-object v9

    .line 205
    invoke-interface {v9}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    .line 206
    .line 207
    .line 208
    move-result-object v9

    .line 209
    invoke-static {v7, v8}, Lx/E5;->e0(Lx/P8;Ljava/lang/String;)Ljava/lang/String;

    .line 210
    .line 211
    .line 212
    move-result-object v10

    .line 213
    invoke-interface {v9, v10}, Landroid/content/SharedPreferences$Editor;->remove(Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    .line 214
    .line 215
    .line 216
    move-result-object v9

    .line 217
    invoke-interface {v9}, Landroid/content/SharedPreferences$Editor;->apply()V

    .line 218
    .line 219
    .line 220
    :cond_f
    :goto_4
    :try_start_0
    new-instance v9, Lorg/json/JSONObject;

    .line 221
    .line 222
    invoke-direct {v9}, Lorg/json/JSONObject;-><init>()V

    .line 223
    .line 224
    .line 225
    const-string v10, "source"

    .line 226
    .line 227
    invoke-virtual {v7}, Ljava/lang/Enum;->name()Ljava/lang/String;

    .line 228
    .line 229
    .line 230
    move-result-object v11

    .line 231
    invoke-virtual {v9, v10, v11}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 232
    .line 233
    .line 234
    const-string v10, "itemId"

    .line 235
    .line 236
    invoke-static {v8}, Lx/E5;->a0(Ljava/lang/String;)Ljava/lang/String;

    .line 237
    .line 238
    .line 239
    move-result-object v11

    .line 240
    invoke-virtual {v9, v10, v11}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 241
    .line 242
    .line 243
    const-string v10, "name"

    .line 244
    .line 245
    iget-object v11, v1, Lx/i9;->c:Ljava/lang/String;

    .line 246
    .line 247
    invoke-static {v11}, Lx/E5;->a0(Ljava/lang/String;)Ljava/lang/String;

    .line 248
    .line 249
    .line 250
    move-result-object v11

    .line 251
    invoke-virtual {v9, v10, v11}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 252
    .line 253
    .line 254
    const-string v10, "logo"

    .line 255
    .line 256
    iget-object v1, v1, Lx/i9;->k:Ljava/lang/String;

    .line 257
    .line 258
    invoke-static {v1}, Lx/E5;->a0(Ljava/lang/String;)Ljava/lang/String;

    .line 259
    .line 260
    .line 261
    move-result-object v1

    .line 262
    invoke-virtual {v9, v10, v1}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 263
    .line 264
    .line 265
    const-string v1, "positionMs"

    .line 266
    .line 267
    if-eqz v6, :cond_10

    .line 268
    .line 269
    move-wide v4, v2

    .line 270
    :cond_10
    invoke-virtual {v9, v1, v4, v5}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    .line 271
    .line 272
    .line 273
    const-string v1, "durationMs"

    .line 274
    .line 275
    invoke-virtual {v9, v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    .line 276
    .line 277
    .line 278
    const-string v1, "updatedAt"

    .line 279
    .line 280
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    .line 281
    .line 282
    .line 283
    move-result-wide v2

    .line 284
    invoke-virtual {v9, v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    .line 285
    .line 286
    .line 287
    invoke-static {v0}, Lx/E5;->T(Landroid/content/Context;)Landroid/content/SharedPreferences;

    .line 288
    .line 289
    .line 290
    move-result-object v1

    .line 291
    invoke-interface {v1}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    .line 292
    .line 293
    .line 294
    move-result-object v1

    .line 295
    invoke-static {v7, v8}, Lx/E5;->C(Lx/P8;Ljava/lang/String;)Ljava/lang/String;

    .line 296
    .line 297
    .line 298
    move-result-object v2

    .line 299
    invoke-virtual {v9}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    .line 300
    .line 301
    .line 302
    move-result-object v3

    .line 303
    invoke-interface {v1, v2, v3}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    .line 304
    .line 305
    .line 306
    move-result-object v1

    .line 307
    invoke-interface {v1}, Landroid/content/SharedPreferences$Editor;->apply()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 308
    .line 309
    .line 310
    :catch_0
    :cond_11
    :goto_5
    return-void
.end method

.method public final T(J)V
    .locals 10

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 2
    .line 3
    if-nez v0, :cond_0

    .line 4
    .line 5
    return-void

    .line 6
    :cond_0
    invoke-virtual {v0}, Lx/Z5;->g()Z

    .line 7
    .line 8
    .line 9
    move-result v0

    .line 10
    const/4 v1, 0x0

    .line 11
    if-nez v0, :cond_1

    .line 12
    .line 13
    const-string p1, "Este canal no permite desplazamiento DVR"

    .line 14
    .line 15
    invoke-static {p0, p1, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    .line 16
    .line 17
    .line 18
    move-result-object p1

    .line 19
    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    .line 20
    .line 21
    .line 22
    return-void

    .line 23
    :cond_1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 24
    .line 25
    invoke-virtual {v0}, Lx/nj;->x()J

    .line 26
    .line 27
    .line 28
    move-result-wide v2

    .line 29
    const-wide/16 v4, 0x0

    .line 30
    .line 31
    invoke-static {v4, v5, v2, v3}, Ljava/lang/Math;->max(JJ)J

    .line 32
    .line 33
    .line 34
    move-result-wide v2

    .line 35
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 36
    .line 37
    invoke-virtual {v0}, Lx/nj;->C()J

    .line 38
    .line 39
    .line 40
    move-result-wide v6

    .line 41
    add-long/2addr v2, p1

    .line 42
    cmp-long p1, p1, v4

    .line 43
    .line 44
    const/4 p2, 0x5

    .line 45
    if-gez p1, :cond_2

    .line 46
    .line 47
    invoke-static {v4, v5, v2, v3}, Ljava/lang/Math;->max(JJ)J

    .line 48
    .line 49
    .line 50
    move-result-wide v2

    .line 51
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 52
    .line 53
    invoke-virtual {v0, p2, v2, v3}, Lx/Z5;->k(IJ)V

    .line 54
    .line 55
    .line 56
    goto :goto_0

    .line 57
    :cond_2
    const-wide v8, -0x7fffffffffffffffL    # -4.9E-324

    .line 58
    .line 59
    .line 60
    .line 61
    .line 62
    cmp-long v0, v6, v8

    .line 63
    .line 64
    if-eqz v0, :cond_4

    .line 65
    .line 66
    cmp-long v0, v6, v4

    .line 67
    .line 68
    if-lez v0, :cond_4

    .line 69
    .line 70
    const-wide/16 v4, 0x5dc

    .line 71
    .line 72
    sub-long v4, v6, v4

    .line 73
    .line 74
    cmp-long v0, v2, v4

    .line 75
    .line 76
    if-ltz v0, :cond_3

    .line 77
    .line 78
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 79
    .line 80
    invoke-virtual {v0}, Lx/Z5;->f()Z

    .line 81
    .line 82
    .line 83
    move-result v0

    .line 84
    if-eqz v0, :cond_3

    .line 85
    .line 86
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 87
    .line 88
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 89
    .line 90
    .line 91
    invoke-virtual {p1}, Lx/nj;->v()I

    .line 92
    .line 93
    .line 94
    move-result p2

    .line 95
    invoke-virtual {p1, p2, v8, v9, v1}, Lx/Z5;->j(IJZ)V

    .line 96
    .line 97
    .line 98
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 99
    .line 100
    invoke-virtual {p1}, Lx/Z5;->i()V

    .line 101
    .line 102
    .line 103
    const-string p1, "EN VIVO"

    .line 104
    .line 105
    invoke-static {p0, p1, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    .line 106
    .line 107
    .line 108
    move-result-object p1

    .line 109
    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    .line 110
    .line 111
    .line 112
    return-void

    .line 113
    :cond_3
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 114
    .line 115
    invoke-static {v2, v3, v6, v7}, Ljava/lang/Math;->min(JJ)J

    .line 116
    .line 117
    .line 118
    move-result-wide v2

    .line 119
    invoke-virtual {v0, p2, v2, v3}, Lx/Z5;->k(IJ)V

    .line 120
    .line 121
    .line 122
    goto :goto_0

    .line 123
    :cond_4
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 124
    .line 125
    invoke-static {v4, v5, v2, v3}, Ljava/lang/Math;->max(JJ)J

    .line 126
    .line 127
    .line 128
    move-result-wide v2

    .line 129
    invoke-virtual {v0, p2, v2, v3}, Lx/Z5;->k(IJ)V

    .line 130
    .line 131
    .line 132
    :goto_0
    if-gez p1, :cond_5

    .line 133
    .line 134
    const-string p1, "\u22125 min "

    .line 135
    .line 136
    goto :goto_1

    .line 137
    :cond_5
    const-string p1, "+5 min "

    .line 138
    .line 139
    :goto_1
    invoke-static {p0, p1, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    .line 140
    .line 141
    .line 142
    move-result-object p1

    .line 143
    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    .line 144
    .line 145
    .line 146
    return-void
.end method

.method public final U()Z
    .locals 2

    .line 1
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 2
    .line 3
    if-eqz v0, :cond_1

    .line 4
    .line 5
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 6
    .line 7
    if-eqz v0, :cond_1

    .line 8
    .line 9
    sget-object v1, Lx/P8;->j:Lx/P8;

    .line 10
    .line 11
    if-eq v0, v1, :cond_0

    .line 12
    .line 13
    sget-object v1, Lx/P8;->k:Lx/P8;

    .line 14
    .line 15
    if-ne v0, v1, :cond_1

    .line 16
    .line 17
    :cond_0
    const/4 v0, 0x1

    .line 18
    return v0

    .line 19
    :cond_1
    const/4 v0, 0x0

    .line 20
    return v0
.end method

.method public final V(Lx/i9;)V
    .locals 5

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->J:Landroid/widget/TextView;

    .line 2
    .line 3
    sget-object v1, Ljava/util/Locale;->US:Ljava/util/Locale;

    .line 4
    .line 5
    iget v2, p1, Lx/i9;->b:I

    .line 6
    .line 7
    invoke-static {v2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 8
    .line 9
    .line 10
    move-result-object v2

    .line 11
    const/4 v3, 0x1

    .line 12
    new-array v3, v3, [Ljava/lang/Object;

    .line 13
    .line 14
    const/4 v4, 0x0

    .line 15
    aput-object v2, v3, v4

    .line 16
    .line 17
    const-string v2, "%03d"

    .line 18
    .line 19
    invoke-static {v1, v2, v3}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    .line 20
    .line 21
    .line 22
    move-result-object v1

    .line 23
    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 24
    .line 25
    .line 26
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->K:Landroid/widget/TextView;

    .line 27
    .line 28
    iget-object p1, p1, Lx/i9;->c:Ljava/lang/String;

    .line 29
    .line 30
    invoke-virtual {v0, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 31
    .line 32
    .line 33
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->I:Landroid/view/View;

    .line 34
    .line 35
    invoke-virtual {p1, v4}, Landroid/view/View;->setVisibility(I)V

    .line 36
    .line 37
    .line 38
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 39
    .line 40
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->V:Lx/dy;

    .line 41
    .line 42
    invoke-virtual {p1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 43
    .line 44
    .line 45
    const-wide/16 v1, 0xa8c

    .line 46
    .line 47
    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 48
    .line 49
    .line 50
    return-void
.end method

.method public final W()V
    .locals 10

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 2
    .line 3
    const/4 v1, 0x0

    .line 4
    if-nez v0, :cond_0

    .line 5
    .line 6
    const-string v0, "Ajustes disponibles durante la reproducci\u00f3n"

    .line 7
    .line 8
    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    .line 9
    .line 10
    .line 11
    move-result-object v0

    .line 12
    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    .line 13
    .line 14
    .line 15
    return-void

    .line 16
    :cond_0
    iget-boolean v2, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 17
    .line 18
    const/4 v3, 0x1

    .line 19
    if-eqz v2, :cond_1

    .line 20
    .line 21
    invoke-virtual {v0}, Lx/Z5;->f()Z

    .line 22
    .line 23
    .line 24
    move-result v0

    .line 25
    if-eqz v0, :cond_1

    .line 26
    .line 27
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 28
    .line 29
    invoke-virtual {v0}, Lx/Z5;->g()Z

    .line 30
    .line 31
    .line 32
    move-result v0

    .line 33
    if-eqz v0, :cond_1

    .line 34
    .line 35
    move v0, v3

    .line 36
    goto :goto_0

    .line 37
    :cond_1
    move v0, v1

    .line 38
    :goto_0
    const-string v2, "Subt\u00edtulos"

    .line 39
    .line 40
    const/4 v4, 0x3

    .line 41
    const-string v5, "Audio"

    .line 42
    .line 43
    const/4 v6, 0x2

    .line 44
    const-string v7, "Calidad"

    .line 45
    .line 46
    if-eqz v0, :cond_2

    .line 47
    .line 48
    const/4 v8, 0x4

    .line 49
    new-array v8, v8, [Ljava/lang/String;

    .line 50
    .line 51
    const-string v9, "Volver a EN VIVO"

    .line 52
    .line 53
    aput-object v9, v8, v1

    .line 54
    .line 55
    aput-object v7, v8, v3

    .line 56
    .line 57
    aput-object v5, v8, v6

    .line 58
    .line 59
    aput-object v2, v8, v4

    .line 60
    .line 61
    goto :goto_1

    .line 62
    :cond_2
    new-array v8, v4, [Ljava/lang/String;

    .line 63
    .line 64
    aput-object v7, v8, v1

    .line 65
    .line 66
    aput-object v5, v8, v3

    .line 67
    .line 68
    aput-object v2, v8, v6

    .line 69
    .line 70
    :goto_1
    new-instance v1, Lx/n1;

    .line 71
    .line 72
    invoke-direct {v1, p0}, Lx/n1;-><init>(Landroid/content/Context;)V

    .line 73
    .line 74
    .line 75
    const-string v2, "Ajustes"

    .line 76
    .line 77
    invoke-virtual {v1, v2}, Lx/n1;->setTitle(Ljava/lang/CharSequence;)Lx/n1;

    .line 78
    .line 79
    .line 80
    move-result-object v1

    .line 81
    new-instance v2, Lx/qy;

    .line 82
    .line 83
    invoke-direct {v2, p0, v0}, Lx/qy;-><init>(Lcom/cochi/client/PlayerActivity;Z)V

    .line 84
    .line 85
    .line 86
    iget-object v0, v1, Lx/n1;->a:Lx/j1;

    .line 87
    .line 88
    iput-object v8, v0, Lx/j1;->m:[Ljava/lang/CharSequence;

    .line 89
    .line 90
    iput-object v2, v0, Lx/j1;->o:Landroid/content/DialogInterface$OnClickListener;

    .line 91
    .line 92
    invoke-virtual {v1}, Lx/n1;->c()V

    .line 93
    .line 94
    .line 95
    return-void
.end method

.method public final X()V
    .locals 5

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 2
    .line 3
    if-nez v0, :cond_0

    .line 4
    .line 5
    return-void

    .line 6
    :cond_0
    invoke-virtual {v0}, Lx/nj;->A()Lx/fK;

    .line 7
    .line 8
    .line 9
    move-result-object v0

    .line 10
    iget-object v0, v0, Lx/fK;->a:Lx/dp;

    .line 11
    .line 12
    const/4 v1, 0x0

    .line 13
    invoke-virtual {v0, v1}, Lx/dp;->l(I)Lx/bp;

    .line 14
    .line 15
    .line 16
    move-result-object v0

    .line 17
    :cond_1
    invoke-virtual {v0}, Lx/bp;->hasNext()Z

    .line 18
    .line 19
    .line 20
    move-result v1

    .line 21
    const-string v2, "Subt\u00edtulos"

    .line 22
    .line 23
    if-eqz v1, :cond_2

    .line 24
    .line 25
    invoke-virtual {v0}, Lx/bp;->next()Ljava/lang/Object;

    .line 26
    .line 27
    .line 28
    move-result-object v1

    .line 29
    check-cast v1, Lx/eK;

    .line 30
    .line 31
    iget-object v3, v1, Lx/eK;->b:Lx/SJ;

    .line 32
    .line 33
    iget v3, v3, Lx/SJ;->c:I

    .line 34
    .line 35
    const/4 v4, 0x3

    .line 36
    if-ne v3, v4, :cond_1

    .line 37
    .line 38
    iget v1, v1, Lx/eK;->a:I

    .line 39
    .line 40
    if-lez v1, :cond_1

    .line 41
    .line 42
    new-instance v0, Lx/ce;

    .line 43
    .line 44
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 45
    .line 46
    invoke-direct {v0, p0, v2, v1, v4}, Lx/ce;-><init>(Lcom/cochi/client/PlayerActivity;Ljava/lang/String;Lx/nj;I)V

    .line 47
    .line 48
    .line 49
    const/4 v1, 0x1

    .line 50
    iput-boolean v1, v0, Lx/ce;->a:Z

    .line 51
    .line 52
    invoke-virtual {v0}, Lx/ce;->a()Landroid/app/Dialog;

    .line 53
    .line 54
    .line 55
    move-result-object v0

    .line 56
    invoke-virtual {v0}, Landroid/app/Dialog;->show()V

    .line 57
    .line 58
    .line 59
    return-void

    .line 60
    :cond_2
    new-instance v0, Lx/n1;

    .line 61
    .line 62
    invoke-direct {v0, p0}, Lx/n1;-><init>(Landroid/content/Context;)V

    .line 63
    .line 64
    .line 65
    invoke-virtual {v0, v2}, Lx/n1;->setTitle(Ljava/lang/CharSequence;)Lx/n1;

    .line 66
    .line 67
    .line 68
    move-result-object v0

    .line 69
    const-string v1, "Subt\u00edtulos no disponibles para este contenido"

    .line 70
    .line 71
    iget-object v2, v0, Lx/n1;->a:Lx/j1;

    .line 72
    .line 73
    iput-object v1, v2, Lx/j1;->f:Ljava/lang/String;

    .line 74
    .line 75
    const-string v1, "Aceptar"

    .line 76
    .line 77
    const/4 v2, 0x0

    .line 78
    invoke-virtual {v0, v1, v2}, Lx/n1;->b(Ljava/lang/String;Landroid/content/DialogInterface$OnClickListener;)V

    .line 79
    .line 80
    .line 81
    invoke-virtual {v0}, Lx/n1;->c()V

    .line 82
    .line 83
    .line 84
    return-void
.end method

.method public final Y(Ljava/lang/String;I)V
    .locals 2

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 2
    .line 3
    if-nez v0, :cond_0

    .line 4
    .line 5
    return-void

    .line 6
    :cond_0
    new-instance v1, Lx/ce;

    .line 7
    .line 8
    invoke-direct {v1, p0, p1, v0, p2}, Lx/ce;-><init>(Lcom/cochi/client/PlayerActivity;Ljava/lang/String;Lx/nj;I)V

    .line 9
    .line 10
    .line 11
    const/4 p1, 0x0

    .line 12
    iput-boolean p1, v1, Lx/ce;->a:Z

    .line 13
    .line 14
    invoke-virtual {v1}, Lx/ce;->a()Landroid/app/Dialog;

    .line 15
    .line 16
    .line 17
    move-result-object p1

    .line 18
    invoke-virtual {p1}, Landroid/app/Dialog;->show()V

    .line 19
    .line 20
    .line 21
    return-void
.end method

.method public final Z(Lx/W6;Ljava/lang/String;)V
    .locals 5

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 2
    .line 3
    if-eqz v0, :cond_1

    .line 4
    .line 5
    if-eqz p1, :cond_1

    .line 6
    .line 7
    iget-wide v1, p1, Lx/W6;->b:J

    .line 8
    .line 9
    iget-wide v3, p1, Lx/W6;->a:J

    .line 10
    .line 11
    cmp-long p1, v1, v3

    .line 12
    .line 13
    if-lez p1, :cond_1

    .line 14
    .line 15
    invoke-virtual {v0}, Lx/Z5;->g()Z

    .line 16
    .line 17
    .line 18
    move-result p1

    .line 19
    const/4 v0, 0x0

    .line 20
    if-nez p1, :cond_0

    .line 21
    .line 22
    const-string p1, "Este contenido no permite saltar"

    .line 23
    .line 24
    invoke-static {p0, p1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    .line 25
    .line 26
    .line 27
    move-result-object p1

    .line 28
    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    .line 29
    .line 30
    .line 31
    return-void

    .line 32
    :cond_0
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 33
    .line 34
    const/4 v3, 0x5

    .line 35
    invoke-virtual {p1, v3, v1, v2}, Lx/Z5;->k(IJ)V

    .line 36
    .line 37
    .line 38
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 39
    .line 40
    invoke-virtual {p1}, Lx/Z5;->i()V

    .line 41
    .line 42
    .line 43
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->b0()V

    .line 44
    .line 45
    .line 46
    invoke-static {p0, p2, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    .line 47
    .line 48
    .line 49
    move-result-object p1

    .line 50
    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    .line 51
    .line 52
    .line 53
    :cond_1
    return-void
.end method

.method public final a0()V
    .locals 8

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 2
    .line 3
    if-nez v0, :cond_0

    .line 4
    .line 5
    goto/16 :goto_b

    .line 6
    .line 7
    :cond_0
    iget-object v0, v0, Landroidx/media3/ui/PlayerView;->s:Lx/Gy;

    .line 8
    .line 9
    const/4 v1, 0x0

    .line 10
    const/4 v2, 0x1

    .line 11
    if-eqz v0, :cond_1

    .line 12
    .line 13
    invoke-virtual {v0}, Lx/Gy;->j()Z

    .line 14
    .line 15
    .line 16
    move-result v0

    .line 17
    if-eqz v0, :cond_1

    .line 18
    .line 19
    move v0, v2

    .line 20
    goto :goto_0

    .line 21
    :cond_1
    move v0, v1

    .line 22
    :goto_0
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 23
    .line 24
    const/high16 v4, 0x3f800000    # 1.0f

    .line 25
    .line 26
    const/16 v5, 0x8

    .line 27
    .line 28
    if-eqz v3, :cond_3

    .line 29
    .line 30
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->H()Z

    .line 31
    .line 32
    .line 33
    move-result v3

    .line 34
    if-nez v3, :cond_2

    .line 35
    .line 36
    if-eqz v0, :cond_2

    .line 37
    .line 38
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 39
    .line 40
    invoke-virtual {v3, v1}, Landroid/view/View;->setVisibility(I)V

    .line 41
    .line 42
    .line 43
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 44
    .line 45
    invoke-virtual {v3, v2}, Landroid/view/View;->setEnabled(Z)V

    .line 46
    .line 47
    .line 48
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 49
    .line 50
    invoke-virtual {v3, v2}, Landroid/view/View;->setClickable(Z)V

    .line 51
    .line 52
    .line 53
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 54
    .line 55
    invoke-virtual {v3, v4}, Landroid/view/View;->setAlpha(F)V

    .line 56
    .line 57
    .line 58
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 59
    .line 60
    invoke-virtual {v3}, Landroid/view/View;->bringToFront()V

    .line 61
    .line 62
    .line 63
    goto :goto_1

    .line 64
    :cond_2
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 65
    .line 66
    invoke-virtual {v3, v5}, Landroid/view/View;->setVisibility(I)V

    .line 67
    .line 68
    .line 69
    :cond_3
    :goto_1
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->P:Landroid/view/View;

    .line 70
    .line 71
    if-eqz v3, :cond_11

    .line 72
    .line 73
    iget-boolean v6, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 74
    .line 75
    if-nez v6, :cond_11

    .line 76
    .line 77
    iget-boolean v7, p0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 78
    .line 79
    if-nez v7, :cond_4

    .line 80
    .line 81
    goto/16 :goto_a

    .line 82
    .line 83
    :cond_4
    if-eqz v0, :cond_10

    .line 84
    .line 85
    if-nez v6, :cond_f

    .line 86
    .line 87
    if-nez v7, :cond_5

    .line 88
    .line 89
    goto/16 :goto_9

    .line 90
    .line 91
    :cond_5
    invoke-virtual {v3, v1}, Landroid/view/View;->setVisibility(I)V

    .line 92
    .line 93
    .line 94
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->P:Landroid/view/View;

    .line 95
    .line 96
    invoke-virtual {v0}, Landroid/view/View;->bringToFront()V

    .line 97
    .line 98
    .line 99
    iget v0, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 100
    .line 101
    if-lez v0, :cond_6

    .line 102
    .line 103
    invoke-static {}, Lx/o9;->d()I

    .line 104
    .line 105
    .line 106
    move-result v0

    .line 107
    if-lez v0, :cond_6

    .line 108
    .line 109
    move v0, v2

    .line 110
    goto :goto_2

    .line 111
    :cond_6
    move v0, v1

    .line 112
    :goto_2
    iget v3, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 113
    .line 114
    if-ltz v3, :cond_7

    .line 115
    .line 116
    add-int/2addr v3, v2

    .line 117
    invoke-static {}, Lx/o9;->d()I

    .line 118
    .line 119
    .line 120
    move-result v5

    .line 121
    if-ge v3, v5, :cond_7

    .line 122
    .line 123
    move v3, v2

    .line 124
    goto :goto_3

    .line 125
    :cond_7
    move v3, v1

    .line 126
    :goto_3
    iget-object v5, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 127
    .line 128
    sget-object v6, Lx/P8;->j:Lx/P8;

    .line 129
    .line 130
    if-ne v5, v6, :cond_8

    .line 131
    .line 132
    goto :goto_4

    .line 133
    :cond_8
    move v2, v1

    .line 134
    :goto_4
    iget-object v5, p0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 135
    .line 136
    invoke-virtual {v5, v0}, Landroid/view/View;->setEnabled(Z)V

    .line 137
    .line 138
    .line 139
    iget-object v5, p0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 140
    .line 141
    invoke-virtual {v5, v0}, Landroid/view/View;->setClickable(Z)V

    .line 142
    .line 143
    .line 144
    iget-object v5, p0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 145
    .line 146
    const v6, 0x3ea3d70a    # 0.32f

    .line 147
    .line 148
    .line 149
    if-eqz v0, :cond_9

    .line 150
    .line 151
    move v0, v4

    .line 152
    goto :goto_5

    .line 153
    :cond_9
    move v0, v6

    .line 154
    :goto_5
    invoke-virtual {v5, v0}, Landroid/view/View;->setAlpha(F)V

    .line 155
    .line 156
    .line 157
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 158
    .line 159
    invoke-virtual {v0, v1}, Landroid/view/View;->setVisibility(I)V

    .line 160
    .line 161
    .line 162
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 163
    .line 164
    iget-object v5, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 165
    .line 166
    sget-object v7, Lx/P8;->k:Lx/P8;

    .line 167
    .line 168
    if-ne v5, v7, :cond_a

    .line 169
    .line 170
    const-string v5, "Cap\u00edtulo anterior"

    .line 171
    .line 172
    goto :goto_6

    .line 173
    :cond_a
    if-eqz v2, :cond_b

    .line 174
    .line 175
    const-string v5, "Pel\u00edcula anterior"

    .line 176
    .line 177
    goto :goto_6

    .line 178
    :cond_b
    const-string v5, "Contenido anterior"

    .line 179
    .line 180
    :goto_6
    invoke-virtual {v0, v5}, Landroid/view/View;->setContentDescription(Ljava/lang/CharSequence;)V

    .line 181
    .line 182
    .line 183
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 184
    .line 185
    invoke-virtual {v0, v3}, Landroid/view/View;->setEnabled(Z)V

    .line 186
    .line 187
    .line 188
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 189
    .line 190
    invoke-virtual {v0, v3}, Landroid/view/View;->setClickable(Z)V

    .line 191
    .line 192
    .line 193
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 194
    .line 195
    if-eqz v3, :cond_c

    .line 196
    .line 197
    goto :goto_7

    .line 198
    :cond_c
    move v4, v6

    .line 199
    :goto_7
    invoke-virtual {v0, v4}, Landroid/view/View;->setAlpha(F)V

    .line 200
    .line 201
    .line 202
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 203
    .line 204
    invoke-virtual {v0, v1}, Landroid/view/View;->setVisibility(I)V

    .line 205
    .line 206
    .line 207
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 208
    .line 209
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 210
    .line 211
    if-ne v1, v7, :cond_d

    .line 212
    .line 213
    const-string v1, "Cap\u00edtulo siguiente"

    .line 214
    .line 215
    goto :goto_8

    .line 216
    :cond_d
    if-eqz v2, :cond_e

    .line 217
    .line 218
    const-string v1, "Pel\u00edcula siguiente"

    .line 219
    .line 220
    goto :goto_8

    .line 221
    :cond_e
    const-string v1, "Contenido siguiente"

    .line 222
    .line 223
    :goto_8
    invoke-virtual {v0, v1}, Landroid/view/View;->setContentDescription(Ljava/lang/CharSequence;)V

    .line 224
    .line 225
    .line 226
    :cond_f
    :goto_9
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 227
    .line 228
    if-eqz v0, :cond_12

    .line 229
    .line 230
    invoke-virtual {v0}, Landroid/view/View;->getVisibility()I

    .line 231
    .line 232
    .line 233
    move-result v0

    .line 234
    if-nez v0, :cond_12

    .line 235
    .line 236
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 237
    .line 238
    invoke-virtual {v0}, Landroid/view/View;->bringToFront()V

    .line 239
    .line 240
    .line 241
    return-void

    .line 242
    :cond_10
    invoke-virtual {v3, v5}, Landroid/view/View;->setVisibility(I)V

    .line 243
    .line 244
    .line 245
    return-void

    .line 246
    :cond_11
    :goto_a
    if-eqz v3, :cond_12

    .line 247
    .line 248
    invoke-virtual {v3, v5}, Landroid/view/View;->setVisibility(I)V

    .line 249
    .line 250
    .line 251
    :cond_12
    :goto_b
    return-void
.end method

.method public final b0()V
    .locals 12

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 2
    .line 3
    if-eqz v0, :cond_9

    .line 4
    .line 5
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 6
    .line 7
    sget-object v1, Lx/P8;->k:Lx/P8;

    .line 8
    .line 9
    if-ne v0, v1, :cond_9

    .line 10
    .line 11
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->T:Lx/hF;

    .line 12
    .line 13
    invoke-virtual {v0}, Lx/hF;->a()Z

    .line 14
    .line 15
    .line 16
    move-result v0

    .line 17
    if-eqz v0, :cond_0

    .line 18
    .line 19
    goto/16 :goto_7

    .line 20
    .line 21
    :cond_0
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 22
    .line 23
    invoke-virtual {v0}, Lx/nj;->x()J

    .line 24
    .line 25
    .line 26
    move-result-wide v0

    .line 27
    const-wide/16 v2, 0x0

    .line 28
    .line 29
    invoke-static {v2, v3, v0, v1}, Ljava/lang/Math;->max(JJ)J

    .line 30
    .line 31
    .line 32
    move-result-wide v0

    .line 33
    iget-object v4, p0, Lcom/cochi/client/PlayerActivity;->T:Lx/hF;

    .line 34
    .line 35
    iget-object v5, v4, Lx/hF;->a:Lx/W6;

    .line 36
    .line 37
    const/4 v6, 0x1

    .line 38
    const/4 v7, 0x0

    .line 39
    if-eqz v5, :cond_1

    .line 40
    .line 41
    iget-wide v8, v5, Lx/W6;->b:J

    .line 42
    .line 43
    iget-wide v10, v5, Lx/W6;->a:J

    .line 44
    .line 45
    cmp-long v5, v8, v10

    .line 46
    .line 47
    if-lez v5, :cond_1

    .line 48
    .line 49
    cmp-long v5, v0, v10

    .line 50
    .line 51
    if-ltz v5, :cond_1

    .line 52
    .line 53
    cmp-long v5, v0, v8

    .line 54
    .line 55
    if-gez v5, :cond_1

    .line 56
    .line 57
    move v5, v6

    .line 58
    goto :goto_0

    .line 59
    :cond_1
    move v5, v7

    .line 60
    :goto_0
    iget-object v4, v4, Lx/hF;->b:Lx/W6;

    .line 61
    .line 62
    if-eqz v4, :cond_2

    .line 63
    .line 64
    iget-wide v8, v4, Lx/W6;->b:J

    .line 65
    .line 66
    iget-wide v10, v4, Lx/W6;->a:J

    .line 67
    .line 68
    cmp-long v4, v8, v10

    .line 69
    .line 70
    if-lez v4, :cond_2

    .line 71
    .line 72
    cmp-long v4, v0, v10

    .line 73
    .line 74
    if-ltz v4, :cond_2

    .line 75
    .line 76
    cmp-long v4, v0, v8

    .line 77
    .line 78
    if-gez v4, :cond_2

    .line 79
    .line 80
    move v4, v6

    .line 81
    goto :goto_1

    .line 82
    :cond_2
    move v4, v7

    .line 83
    :goto_1
    iget v8, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 84
    .line 85
    add-int/2addr v8, v6

    .line 86
    invoke-static {}, Lx/o9;->d()I

    .line 87
    .line 88
    .line 89
    move-result v9

    .line 90
    if-ge v8, v9, :cond_3

    .line 91
    .line 92
    iget-object v8, p0, Lcom/cochi/client/PlayerActivity;->T:Lx/hF;

    .line 93
    .line 94
    iget-wide v8, v8, Lx/hF;->c:J

    .line 95
    .line 96
    cmp-long v2, v8, v2

    .line 97
    .line 98
    if-ltz v2, :cond_3

    .line 99
    .line 100
    cmp-long v0, v0, v8

    .line 101
    .line 102
    if-ltz v0, :cond_3

    .line 103
    .line 104
    goto :goto_2

    .line 105
    :cond_3
    move v6, v7

    .line 106
    :goto_2
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->M:Lcom/google/android/material/button/MaterialButton;

    .line 107
    .line 108
    const/16 v1, 0x8

    .line 109
    .line 110
    if-eqz v5, :cond_4

    .line 111
    .line 112
    move v2, v7

    .line 113
    goto :goto_3

    .line 114
    :cond_4
    move v2, v1

    .line 115
    :goto_3
    invoke-virtual {v0, v2}, Landroid/view/View;->setVisibility(I)V

    .line 116
    .line 117
    .line 118
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->N:Lcom/google/android/material/button/MaterialButton;

    .line 119
    .line 120
    if-eqz v4, :cond_5

    .line 121
    .line 122
    move v2, v7

    .line 123
    goto :goto_4

    .line 124
    :cond_5
    move v2, v1

    .line 125
    :goto_4
    invoke-virtual {v0, v2}, Landroid/view/View;->setVisibility(I)V

    .line 126
    .line 127
    .line 128
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->O:Lcom/google/android/material/button/MaterialButton;

    .line 129
    .line 130
    if-eqz v6, :cond_6

    .line 131
    .line 132
    move v2, v7

    .line 133
    goto :goto_5

    .line 134
    :cond_6
    move v2, v1

    .line 135
    :goto_5
    invoke-virtual {v0, v2}, Landroid/view/View;->setVisibility(I)V

    .line 136
    .line 137
    .line 138
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->L:Landroid/view/View;

    .line 139
    .line 140
    if-nez v5, :cond_8

    .line 141
    .line 142
    if-nez v4, :cond_8

    .line 143
    .line 144
    if-eqz v6, :cond_7

    .line 145
    .line 146
    goto :goto_6

    .line 147
    :cond_7
    move v7, v1

    .line 148
    :cond_8
    :goto_6
    invoke-virtual {v0, v7}, Landroid/view/View;->setVisibility(I)V

    .line 149
    .line 150
    .line 151
    return-void

    .line 152
    :cond_9
    :goto_7
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->E()V

    .line 153
    .line 154
    .line 155
    return-void
.end method

.method public final c0(ZLx/fy;)V
    .locals 3

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 2
    .line 3
    sget-object v1, Lx/P8;->k:Lx/P8;

    .line 4
    .line 5
    if-eq v0, v1, :cond_0

    .line 6
    .line 7
    if-eqz p2, :cond_3

    .line 8
    .line 9
    invoke-virtual {p2}, Lx/fy;->run()V

    .line 10
    .line 11
    .line 12
    return-void

    .line 13
    :cond_0
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->t0:Z

    .line 14
    .line 15
    if-eqz v0, :cond_1

    .line 16
    .line 17
    goto :goto_0

    .line 18
    :cond_1
    if-eqz p2, :cond_2

    .line 19
    .line 20
    invoke-static {}, Lx/nF;->o0()Z

    .line 21
    .line 22
    .line 23
    move-result v0

    .line 24
    if-eqz v0, :cond_2

    .line 25
    .line 26
    invoke-virtual {p2}, Lx/fy;->run()V

    .line 27
    .line 28
    .line 29
    return-void

    .line 30
    :cond_2
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->s0:Z

    .line 31
    .line 32
    if-eqz v0, :cond_4

    .line 33
    .line 34
    if-eqz p2, :cond_3

    .line 35
    .line 36
    iput-object p2, p0, Lcom/cochi/client/PlayerActivity;->u0:Ljava/lang/Runnable;

    .line 37
    .line 38
    :cond_3
    :goto_0
    return-void

    .line 39
    :cond_4
    const/4 v0, 0x1

    .line 40
    iput-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->s0:Z

    .line 41
    .line 42
    const/4 v1, 0x0

    .line 43
    if-nez p1, :cond_6

    .line 44
    .line 45
    if-eqz p2, :cond_5

    .line 46
    .line 47
    goto :goto_1

    .line 48
    :cond_5
    move v0, v1

    .line 49
    :cond_6
    :goto_1
    if-eqz v0, :cond_7

    .line 50
    .line 51
    iget-object v2, p0, Lcom/cochi/client/PlayerActivity;->H:Landroid/widget/ProgressBar;

    .line 52
    .line 53
    invoke-virtual {v2, v1}, Landroid/view/View;->setVisibility(I)V

    .line 54
    .line 55
    .line 56
    :cond_7
    new-instance v1, Ljava/lang/Thread;

    .line 57
    .line 58
    new-instance v2, Lx/my;

    .line 59
    .line 60
    invoke-direct {v2, p0, v0, p2, p1}, Lx/my;-><init>(Lcom/cochi/client/PlayerActivity;ZLjava/lang/Runnable;Z)V

    .line 61
    .line 62
    .line 63
    const-string p1, "cochi-series-player-access"

    .line 64
    .line 65
    invoke-direct {v1, v2, p1}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;Ljava/lang/String;)V

    .line 66
    .line 67
    .line 68
    invoke-virtual {v1}, Ljava/lang/Thread;->start()V

    .line 69
    .line 70
    .line 71
    return-void
.end method

.method public final d0(I)V
    .locals 3

    .line 1
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->S()V

    .line 2
    .line 3
    .line 4
    invoke-static {}, Lx/o9;->d()I

    .line 5
    .line 6
    .line 7
    move-result v0

    .line 8
    const/4 v1, 0x2

    .line 9
    if-ge v0, v1, :cond_1

    .line 10
    .line 11
    iget p1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 12
    .line 13
    invoke-static {p1}, Lx/o9;->a(I)Lx/i9;

    .line 14
    .line 15
    .line 16
    move-result-object p1

    .line 17
    if-eqz p1, :cond_0

    .line 18
    .line 19
    invoke-virtual {p0, p1}, Lcom/cochi/client/PlayerActivity;->V(Lx/i9;)V

    .line 20
    .line 21
    .line 22
    :cond_0
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->D()V

    .line 23
    .line 24
    .line 25
    return-void

    .line 26
    :cond_1
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->D()V

    .line 27
    .line 28
    .line 29
    iget v0, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 30
    .line 31
    add-int/2addr v0, p1

    .line 32
    const-wide/16 v1, 0x0

    .line 33
    .line 34
    invoke-virtual {p0, v0, v1, v2}, Lcom/cochi/client/PlayerActivity;->L(IJ)V

    .line 35
    .line 36
    .line 37
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->D()V

    .line 38
    .line 39
    .line 40
    return-void
.end method

.method public final dispatchKeyEvent(Landroid/view/KeyEvent;)Z
    .locals 4

    .line 1
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 2
    .line 3
    if-eqz v0, :cond_7

    .line 4
    .line 5
    invoke-virtual {p1}, Landroid/view/KeyEvent;->getAction()I

    .line 6
    .line 7
    .line 8
    move-result v0

    .line 9
    if-nez v0, :cond_7

    .line 10
    .line 11
    invoke-virtual {p1}, Landroid/view/KeyEvent;->getRepeatCount()I

    .line 12
    .line 13
    .line 14
    move-result v0

    .line 15
    if-nez v0, :cond_7

    .line 16
    .line 17
    invoke-virtual {p1}, Landroid/view/KeyEvent;->getKeyCode()I

    .line 18
    .line 19
    .line 20
    move-result v0

    .line 21
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 22
    .line 23
    const/4 v2, 0x1

    .line 24
    if-eqz v1, :cond_0

    .line 25
    .line 26
    iget-object v1, v1, Landroidx/media3/ui/PlayerView;->s:Lx/Gy;

    .line 27
    .line 28
    if-eqz v1, :cond_0

    .line 29
    .line 30
    invoke-virtual {v1}, Lx/Gy;->j()Z

    .line 31
    .line 32
    .line 33
    move-result v1

    .line 34
    if-eqz v1, :cond_0

    .line 35
    .line 36
    move v1, v2

    .line 37
    goto :goto_0

    .line 38
    :cond_0
    const/4 v1, 0x0

    .line 39
    :goto_0
    const/16 v3, 0xa6

    .line 40
    .line 41
    if-eq v0, v3, :cond_6

    .line 42
    .line 43
    const/16 v3, 0x13

    .line 44
    .line 45
    if-ne v0, v3, :cond_1

    .line 46
    .line 47
    if-nez v1, :cond_1

    .line 48
    .line 49
    goto :goto_2

    .line 50
    :cond_1
    const/16 v3, 0xa7

    .line 51
    .line 52
    if-eq v0, v3, :cond_5

    .line 53
    .line 54
    const/16 v3, 0x14

    .line 55
    .line 56
    if-ne v0, v3, :cond_2

    .line 57
    .line 58
    if-nez v1, :cond_2

    .line 59
    .line 60
    goto :goto_1

    .line 61
    :cond_2
    const/16 v1, 0xa5

    .line 62
    .line 63
    if-ne v0, v1, :cond_4

    .line 64
    .line 65
    iget p1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 66
    .line 67
    invoke-static {p1}, Lx/o9;->a(I)Lx/i9;

    .line 68
    .line 69
    .line 70
    move-result-object p1

    .line 71
    if-eqz p1, :cond_3

    .line 72
    .line 73
    invoke-virtual {p0, p1}, Lcom/cochi/client/PlayerActivity;->V(Lx/i9;)V

    .line 74
    .line 75
    .line 76
    :cond_3
    return v2

    .line 77
    :cond_4
    const/16 v1, 0x52

    .line 78
    .line 79
    if-ne v0, v1, :cond_7

    .line 80
    .line 81
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->W()V

    .line 82
    .line 83
    .line 84
    return v2

    .line 85
    :cond_5
    :goto_1
    const/4 p1, -0x1

    .line 86
    invoke-virtual {p0, p1}, Lcom/cochi/client/PlayerActivity;->d0(I)V

    .line 87
    .line 88
    .line 89
    return v2

    .line 90
    :cond_6
    :goto_2
    invoke-virtual {p0, v2}, Lcom/cochi/client/PlayerActivity;->d0(I)V

    .line 91
    .line 92
    .line 93
    return v2

    .line 94
    :cond_7
    invoke-super {p0, p1}, Lx/W1;->dispatchKeyEvent(Landroid/view/KeyEvent;)Z

    .line 95
    .line 96
    .line 97
    move-result p1

    .line 98
    return p1
.end method

.method public final dispatchTouchEvent(Landroid/view/MotionEvent;)Z
    .locals 4

    .line 1
    invoke-super {p0, p1}, Landroid/app/Activity;->dispatchTouchEvent(Landroid/view/MotionEvent;)Z

    .line 2
    .line 3
    .line 4
    move-result v0

    .line 5
    if-eqz p1, :cond_0

    .line 6
    .line 7
    invoke-virtual {p1}, Landroid/view/MotionEvent;->getActionMasked()I

    .line 8
    .line 9
    .line 10
    move-result p1

    .line 11
    if-nez p1, :cond_0

    .line 12
    .line 13
    iget-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 14
    .line 15
    if-eqz p1, :cond_0

    .line 16
    .line 17
    iget-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 18
    .line 19
    if-nez p1, :cond_0

    .line 20
    .line 21
    new-instance p1, Lx/dy;

    .line 22
    .line 23
    const/4 v1, 0x2

    .line 24
    invoke-direct {p1, p0, v1}, Lx/dy;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 25
    .line 26
    .line 27
    const-wide/16 v1, 0x50

    .line 28
    .line 29
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 30
    .line 31
    invoke-virtual {v3, p1, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 32
    .line 33
    .line 34
    :cond_0
    return v0
.end method

.method public final onCreate(Landroid/os/Bundle;)V
    .locals 14

    .line 1
    invoke-super {p0, p1}, Lx/W1;->onCreate(Landroid/os/Bundle;)V

    .line 2
    .line 3
    .line 4
    const p1, 0x7f0d0022

    .line 5
    .line 6
    .line 7
    invoke-virtual {p0, p1}, Lx/W1;->setContentView(I)V

    .line 8
    .line 9
    .line 10
    invoke-virtual {p0}, Landroid/content/Context;->getApplicationContext()Landroid/content/Context;

    .line 11
    .line 12
    .line 13
    move-result-object p1

    .line 14
    invoke-static {p1}, Lcom/tuempresa/motor/MotorPrivado;->initialize(Landroid/content/Context;)V

    .line 15
    .line 16
    .line 17
    invoke-virtual {p0}, Landroid/app/Activity;->getWindow()Landroid/view/Window;

    .line 18
    .line 19
    .line 20
    move-result-object p1

    .line 21
    const/16 v0, 0x80

    .line 22
    .line 23
    invoke-virtual {p1, v0}, Landroid/view/Window;->addFlags(I)V

    .line 24
    .line 25
    .line 26
    invoke-virtual {p0}, Landroid/app/Activity;->getWindow()Landroid/view/Window;

    .line 27
    .line 28
    .line 29
    move-result-object p1

    .line 30
    const/16 v0, 0x2000

    .line 31
    .line 32
    invoke-virtual {p1, v0}, Landroid/view/Window;->addFlags(I)V

    .line 33
    .line 34
    .line 35
    const p1, 0x7f0a01b5

    .line 36
    .line 37
    .line 38
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 39
    .line 40
    .line 41
    move-result-object p1

    .line 42
    check-cast p1, Landroidx/media3/ui/PlayerView;

    .line 43
    .line 44
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 45
    .line 46
    const p1, 0x7f0a0267

    .line 47
    .line 48
    .line 49
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 50
    .line 51
    .line 52
    move-result-object p1

    .line 53
    check-cast p1, Landroid/webkit/WebView;

    .line 54
    .line 55
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 56
    .line 57
    const p1, 0x7f0a0149

    .line 58
    .line 59
    .line 60
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 61
    .line 62
    .line 63
    move-result-object p1

    .line 64
    check-cast p1, Landroid/widget/ProgressBar;

    .line 65
    .line 66
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->H:Landroid/widget/ProgressBar;

    .line 67
    .line 68
    const p1, 0x7f0a0073

    .line 69
    .line 70
    .line 71
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 72
    .line 73
    .line 74
    move-result-object p1

    .line 75
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->I:Landroid/view/View;

    .line 76
    .line 77
    const p1, 0x7f0a0075

    .line 78
    .line 79
    .line 80
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 81
    .line 82
    .line 83
    move-result-object p1

    .line 84
    check-cast p1, Landroid/widget/TextView;

    .line 85
    .line 86
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->J:Landroid/widget/TextView;

    .line 87
    .line 88
    const p1, 0x7f0a0074

    .line 89
    .line 90
    .line 91
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 92
    .line 93
    .line 94
    move-result-object p1

    .line 95
    check-cast p1, Landroid/widget/TextView;

    .line 96
    .line 97
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->K:Landroid/widget/TextView;

    .line 98
    .line 99
    const p1, 0x7f0a00bd

    .line 100
    .line 101
    .line 102
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 103
    .line 104
    .line 105
    move-result-object p1

    .line 106
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->L:Landroid/view/View;

    .line 107
    .line 108
    const p1, 0x7f0a01ec

    .line 109
    .line 110
    .line 111
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 112
    .line 113
    .line 114
    move-result-object p1

    .line 115
    check-cast p1, Lcom/google/android/material/button/MaterialButton;

    .line 116
    .line 117
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->M:Lcom/google/android/material/button/MaterialButton;

    .line 118
    .line 119
    const p1, 0x7f0a01eb

    .line 120
    .line 121
    .line 122
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 123
    .line 124
    .line 125
    move-result-object p1

    .line 126
    check-cast p1, Lcom/google/android/material/button/MaterialButton;

    .line 127
    .line 128
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->N:Lcom/google/android/material/button/MaterialButton;

    .line 129
    .line 130
    const p1, 0x7f0a018e

    .line 131
    .line 132
    .line 133
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 134
    .line 135
    .line 136
    move-result-object p1

    .line 137
    check-cast p1, Lcom/google/android/material/button/MaterialButton;

    .line 138
    .line 139
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->O:Lcom/google/android/material/button/MaterialButton;

    .line 140
    .line 141
    const p1, 0x7f0a007f

    .line 142
    .line 143
    .line 144
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 145
    .line 146
    .line 147
    move-result-object p1

    .line 148
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->P:Landroid/view/View;

    .line 149
    .line 150
    const p1, 0x7f0a0081

    .line 151
    .line 152
    .line 153
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 154
    .line 155
    .line 156
    move-result-object p1

    .line 157
    check-cast p1, Landroid/widget/ImageButton;

    .line 158
    .line 159
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 160
    .line 161
    const p1, 0x7f0a0080

    .line 162
    .line 163
    .line 164
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 165
    .line 166
    .line 167
    move-result-object p1

    .line 168
    check-cast p1, Landroid/widget/ImageButton;

    .line 169
    .line 170
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 171
    .line 172
    const p1, 0x7f0a0082

    .line 173
    .line 174
    .line 175
    invoke-virtual {p0, p1}, Lx/W1;->findViewById(I)Landroid/view/View;

    .line 176
    .line 177
    .line 178
    move-result-object p1

    .line 179
    check-cast p1, Landroid/widget/ImageButton;

    .line 180
    .line 181
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 182
    .line 183
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->M:Lcom/google/android/material/button/MaterialButton;

    .line 184
    .line 185
    new-instance v0, Lx/ey;

    .line 186
    .line 187
    const/4 v1, 0x6

    .line 188
    invoke-direct {v0, p0, v1}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 189
    .line 190
    .line 191
    invoke-virtual {p1, v0}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 192
    .line 193
    .line 194
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->N:Lcom/google/android/material/button/MaterialButton;

    .line 195
    .line 196
    new-instance v0, Lx/ey;

    .line 197
    .line 198
    const/4 v1, 0x7

    .line 199
    invoke-direct {v0, p0, v1}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 200
    .line 201
    .line 202
    invoke-virtual {p1, v0}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 203
    .line 204
    .line 205
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->O:Lcom/google/android/material/button/MaterialButton;

    .line 206
    .line 207
    new-instance v0, Lx/ey;

    .line 208
    .line 209
    const/16 v1, 0x8

    .line 210
    .line 211
    invoke-direct {v0, p0, v1}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 212
    .line 213
    .line 214
    invoke-virtual {p1, v0}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 215
    .line 216
    .line 217
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->Q:Landroid/widget/ImageButton;

    .line 218
    .line 219
    new-instance v0, Lx/ey;

    .line 220
    .line 221
    const/16 v2, 0x9

    .line 222
    .line 223
    invoke-direct {v0, p0, v2}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 224
    .line 225
    .line 226
    invoke-virtual {p1, v0}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 227
    .line 228
    .line 229
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->R:Landroid/widget/ImageButton;

    .line 230
    .line 231
    new-instance v0, Lx/ey;

    .line 232
    .line 233
    const/16 v2, 0xa

    .line 234
    .line 235
    invoke-direct {v0, p0, v2}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 236
    .line 237
    .line 238
    invoke-virtual {p1, v0}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 239
    .line 240
    .line 241
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->S:Landroid/widget/ImageButton;

    .line 242
    .line 243
    new-instance v0, Lx/ey;

    .line 244
    .line 245
    const/4 v2, 0x0

    .line 246
    invoke-direct {v0, p0, v2}, Lx/ey;-><init>(Lcom/cochi/client/PlayerActivity;I)V

    .line 247
    .line 248
    .line 249
    invoke-virtual {p1, v0}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 250
    .line 251
    .line 252
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->P:Landroid/view/View;

    .line 253
    .line 254
    invoke-virtual {p1, v1}, Landroid/view/View;->setVisibility(I)V

    .line 255
    .line 256
    .line 257
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 258
    .line 259
    .line 260
    move-result-object p1

    .line 261
    const-string v0, "cochi.extra.TV_MODE"

    .line 262
    .line 263
    invoke-virtual {p1, v0, v2}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    .line 264
    .line 265
    .line 266
    move-result p1

    .line 267
    iput-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 268
    .line 269
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 270
    .line 271
    .line 272
    move-result-object p1

    .line 273
    const-string v0, "cochi.extra.STORE_ITEM"

    .line 274
    .line 275
    invoke-virtual {p1, v0, v2}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    .line 276
    .line 277
    .line 278
    move-result p1

    .line 279
    iput-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 280
    .line 281
    iget-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 282
    .line 283
    if-eqz p1, :cond_0

    .line 284
    .line 285
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 286
    .line 287
    invoke-virtual {p1, v2}, Landroidx/media3/ui/PlayerView;->setControllerAutoShow(Z)V

    .line 288
    .line 289
    .line 290
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 291
    .line 292
    invoke-virtual {p1}, Landroidx/media3/ui/PlayerView;->e()V

    .line 293
    .line 294
    .line 295
    :cond_0
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 296
    .line 297
    .line 298
    move-result-object p1

    .line 299
    const-string v0, "cochi.extra.CATALOG_SOURCE"

    .line 300
    .line 301
    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 302
    .line 303
    .line 304
    move-result-object p1

    .line 305
    if-eqz p1, :cond_1

    .line 306
    .line 307
    :try_start_0
    invoke-static {p1}, Lx/P8;->valueOf(Ljava/lang/String;)Lx/P8;

    .line 308
    .line 309
    .line 310
    move-result-object p1

    .line 311
    iput-object p1, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 312
    .line 313
    :catch_0
    :cond_1
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 314
    .line 315
    .line 316
    move-result-object p1

    .line 317
    const-string v0, "cochi.extra.FORCE_START"

    .line 318
    .line 319
    invoke-virtual {p1, v0, v2}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    .line 320
    .line 321
    .line 322
    move-result p1

    .line 323
    iput-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->o0:Z

    .line 324
    .line 325
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 326
    .line 327
    .line 328
    move-result-object p1

    .line 329
    const-string v0, "cochi.extra.AUTO_RESUME"

    .line 330
    .line 331
    invoke-virtual {p1, v0, v2}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    .line 332
    .line 333
    .line 334
    move-result p1

    .line 335
    iput-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->p0:Z

    .line 336
    .line 337
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 338
    .line 339
    .line 340
    move-result-object p1

    .line 341
    const-string v0, "cochi.extra.AUTO_NEXT_SERIES"

    .line 342
    .line 343
    invoke-virtual {p1, v0, v2}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    .line 344
    .line 345
    .line 346
    move-result p1

    .line 347
    iput-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->q0:Z

    .line 348
    .line 349
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 350
    .line 351
    new-instance v0, Lx/i5;

    .line 352
    .line 353
    const/16 v1, 0x16

    .line 354
    .line 355
    invoke-direct {v0, v1, p0}, Lx/i5;-><init>(ILjava/lang/Object;)V

    .line 356
    .line 357
    .line 358
    invoke-virtual {p1, v0}, Landroidx/media3/ui/PlayerView;->setControllerVisibilityListener(Lx/Wy;)V

    .line 359
    .line 360
    .line 361
    iget-object p1, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 362
    .line 363
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->x0:Lx/ry;

    .line 364
    .line 365
    invoke-virtual {p1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 366
    .line 367
    .line 368
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->H()Z

    .line 369
    .line 370
    .line 371
    move-result v1

    .line 372
    if-eqz v1, :cond_2

    .line 373
    .line 374
    iget-boolean v1, p0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 375
    .line 376
    if-eqz v1, :cond_3

    .line 377
    .line 378
    iget-boolean v1, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 379
    .line 380
    if-nez v1, :cond_3

    .line 381
    .line 382
    :cond_2
    invoke-virtual {p1, v0}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 383
    .line 384
    .line 385
    :cond_3
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 386
    .line 387
    sget-object v1, Lx/P8;->k:Lx/P8;

    .line 388
    .line 389
    if-ne v0, v1, :cond_4

    .line 390
    .line 391
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->y0:Lx/ry;

    .line 392
    .line 393
    invoke-virtual {p1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 394
    .line 395
    .line 396
    const-wide/16 v3, 0x7530

    .line 397
    .line 398
    invoke-virtual {p1, v0, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 399
    .line 400
    .line 401
    :cond_4
    iget-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 402
    .line 403
    const-wide/16 v0, 0x0

    .line 404
    .line 405
    if-nez p1, :cond_10

    .line 406
    .line 407
    iget-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 408
    .line 409
    if-eqz p1, :cond_5

    .line 410
    .line 411
    goto/16 :goto_8

    .line 412
    .line 413
    :cond_5
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 414
    .line 415
    .line 416
    move-result-object p1

    .line 417
    const-string v2, "cochi.extra.URL"

    .line 418
    .line 419
    invoke-virtual {p1, v2}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 420
    .line 421
    .line 422
    move-result-object v7

    .line 423
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 424
    .line 425
    .line 426
    move-result-object p1

    .line 427
    const-string v2, "cochi.extra.CLEARKEY_KID"

    .line 428
    .line 429
    invoke-virtual {p1, v2}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 430
    .line 431
    .line 432
    move-result-object p1

    .line 433
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 434
    .line 435
    .line 436
    move-result-object v2

    .line 437
    const-string v3, "cochi.extra.CLEARKEY_KEY"

    .line 438
    .line 439
    invoke-virtual {v2, v3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 440
    .line 441
    .line 442
    move-result-object v2

    .line 443
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 444
    .line 445
    .line 446
    move-result-object v3

    .line 447
    const-string v4, "cochi.extra.CLEARKEY_MULTI"

    .line 448
    .line 449
    invoke-virtual {v3, v4}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 450
    .line 451
    .line 452
    move-result-object v3

    .line 453
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 454
    .line 455
    .line 456
    move-result-object v4

    .line 457
    const-string v5, "cochi.extra.STREAM_TYPE"

    .line 458
    .line 459
    invoke-virtual {v4, v5}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 460
    .line 461
    .line 462
    move-result-object v4

    .line 463
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 464
    .line 465
    .line 466
    move-result-object v5

    .line 467
    const-string v6, "cochi.extra.DISPLAY_NAME"

    .line 468
    .line 469
    invoke-virtual {v5, v6}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 470
    .line 471
    .line 472
    move-result-object v5

    .line 473
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 474
    .line 475
    .line 476
    move-result-object v6

    .line 477
    const-string v8, "cochi.extra.HEADERS_JSON"

    .line 478
    .line 479
    invoke-virtual {v6, v8}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    .line 480
    .line 481
    .line 482
    move-result-object v6

    .line 483
    if-eqz v7, :cond_f

    .line 484
    .line 485
    invoke-virtual {v7}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 486
    .line 487
    .line 488
    move-result-object v8

    .line 489
    invoke-virtual {v8}, Ljava/lang/String;->isEmpty()Z

    .line 490
    .line 491
    .line 492
    move-result v8

    .line 493
    if-eqz v8, :cond_6

    .line 494
    .line 495
    goto/16 :goto_7

    .line 496
    .line 497
    :cond_6
    new-instance v9, Ljava/util/LinkedHashMap;

    .line 498
    .line 499
    invoke-direct {v9}, Ljava/util/LinkedHashMap;-><init>()V

    .line 500
    .line 501
    .line 502
    const-string v8, ""

    .line 503
    .line 504
    if-eqz v6, :cond_8

    .line 505
    .line 506
    invoke-virtual {v6}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 507
    .line 508
    .line 509
    move-result-object v10

    .line 510
    invoke-virtual {v10}, Ljava/lang/String;->isEmpty()Z

    .line 511
    .line 512
    .line 513
    move-result v10

    .line 514
    if-nez v10, :cond_8

    .line 515
    .line 516
    :try_start_1
    new-instance v10, Lorg/json/JSONObject;

    .line 517
    .line 518
    invoke-direct {v10, v6}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 519
    .line 520
    .line 521
    invoke-virtual {v10}, Lorg/json/JSONObject;->keys()Ljava/util/Iterator;

    .line 522
    .line 523
    .line 524
    move-result-object v6

    .line 525
    :cond_7
    :goto_0
    invoke-interface {v6}, Ljava/util/Iterator;->hasNext()Z

    .line 526
    .line 527
    .line 528
    move-result v11

    .line 529
    if-eqz v11, :cond_8

    .line 530
    .line 531
    invoke-interface {v6}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    .line 532
    .line 533
    .line 534
    move-result-object v11

    .line 535
    check-cast v11, Ljava/lang/String;

    .line 536
    .line 537
    invoke-virtual {v10, v11, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 538
    .line 539
    .line 540
    move-result-object v12

    .line 541
    invoke-virtual {v11}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 542
    .line 543
    .line 544
    move-result-object v13

    .line 545
    invoke-virtual {v13}, Ljava/lang/String;->isEmpty()Z

    .line 546
    .line 547
    .line 548
    move-result v13

    .line 549
    if-nez v13, :cond_7

    .line 550
    .line 551
    invoke-virtual {v12}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 552
    .line 553
    .line 554
    move-result-object v13

    .line 555
    invoke-virtual {v13}, Ljava/lang/String;->isEmpty()Z

    .line 556
    .line 557
    .line 558
    move-result v13

    .line 559
    if-nez v13, :cond_7

    .line 560
    .line 561
    invoke-virtual {v9, v11, v12}, Ljava/util/AbstractMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    .line 562
    .line 563
    .line 564
    goto :goto_0

    .line 565
    :catch_1
    :cond_8
    move-object v6, v3

    .line 566
    new-instance v3, Lx/i9;

    .line 567
    .line 568
    if-eqz v5, :cond_a

    .line 569
    .line 570
    invoke-virtual {v5}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 571
    .line 572
    .line 573
    move-result-object v10

    .line 574
    invoke-virtual {v10}, Ljava/lang/String;->isEmpty()Z

    .line 575
    .line 576
    .line 577
    move-result v10

    .line 578
    if-eqz v10, :cond_9

    .line 579
    .line 580
    goto :goto_1

    .line 581
    :cond_9
    invoke-virtual {v5}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 582
    .line 583
    .line 584
    move-result-object v5

    .line 585
    goto :goto_2

    .line 586
    :cond_a
    :goto_1
    const-string v5, "Reproducci\u00f3n"

    .line 587
    .line 588
    :goto_2
    if-eqz v4, :cond_c

    .line 589
    .line 590
    invoke-virtual {v4}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 591
    .line 592
    .line 593
    move-result-object v10

    .line 594
    invoke-virtual {v10}, Ljava/lang/String;->isEmpty()Z

    .line 595
    .line 596
    .line 597
    move-result v10

    .line 598
    if-eqz v10, :cond_b

    .line 599
    .line 600
    goto :goto_3

    .line 601
    :cond_b
    invoke-virtual {v4}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 602
    .line 603
    .line 604
    move-result-object v4

    .line 605
    goto :goto_4

    .line 606
    :cond_c
    :goto_3
    const-string v4, "auto"

    .line 607
    .line 608
    :goto_4
    if-eqz v6, :cond_e

    .line 609
    .line 610
    invoke-virtual {v6}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 611
    .line 612
    .line 613
    move-result-object v10

    .line 614
    invoke-virtual {v10}, Ljava/lang/String;->isEmpty()Z

    .line 615
    .line 616
    .line 617
    move-result v10

    .line 618
    if-nez v10, :cond_e

    .line 619
    .line 620
    move-object v8, v6

    .line 621
    :cond_d
    :goto_5
    move-object v6, v4

    .line 622
    goto :goto_6

    .line 623
    :cond_e
    if-eqz p1, :cond_d

    .line 624
    .line 625
    if-eqz v2, :cond_d

    .line 626
    .line 627
    new-instance v6, Ljava/lang/StringBuilder;

    .line 628
    .line 629
    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    .line 630
    .line 631
    .line 632
    invoke-virtual {v6, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 633
    .line 634
    .line 635
    const-string p1, ":"

    .line 636
    .line 637
    invoke-virtual {v6, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 638
    .line 639
    .line 640
    invoke-virtual {v6, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 641
    .line 642
    .line 643
    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 644
    .line 645
    .line 646
    move-result-object p1

    .line 647
    move-object v8, p1

    .line 648
    goto :goto_5

    .line 649
    :goto_6
    const-string v4, "direct-search"

    .line 650
    .line 651
    invoke-direct/range {v3 .. v9}, Lx/i9;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/util/LinkedHashMap;)V

    .line 652
    .line 653
    .line 654
    invoke-virtual {p0, v3, v0, v1}, Lcom/cochi/client/PlayerActivity;->K(Lx/i9;J)V

    .line 655
    .line 656
    .line 657
    goto/16 :goto_b

    .line 658
    .line 659
    :cond_f
    :goto_7
    invoke-virtual {p0}, Landroid/app/Activity;->finish()V

    .line 660
    .line 661
    .line 662
    goto/16 :goto_b

    .line 663
    .line 664
    :cond_10
    :goto_8
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    .line 665
    .line 666
    .line 667
    move-result-object p1

    .line 668
    const-string v3, "cochi.extra.CHANNEL_INDEX"

    .line 669
    .line 670
    invoke-virtual {p1, v3, v2}, Landroid/content/Intent;->getIntExtra(Ljava/lang/String;I)I

    .line 671
    .line 672
    .line 673
    move-result p1

    .line 674
    iput p1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 675
    .line 676
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->U()Z

    .line 677
    .line 678
    .line 679
    move-result p1

    .line 680
    if-eqz p1, :cond_16

    .line 681
    .line 682
    iget p1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 683
    .line 684
    invoke-static {p1}, Lx/o9;->a(I)Lx/i9;

    .line 685
    .line 686
    .line 687
    move-result-object p1

    .line 688
    if-nez p1, :cond_11

    .line 689
    .line 690
    const/4 p1, 0x0

    .line 691
    goto :goto_9

    .line 692
    :cond_11
    iget-object v3, p0, Lcom/cochi/client/PlayerActivity;->Z:Lx/P8;

    .line 693
    .line 694
    iget-object p1, p1, Lx/i9;->a:Ljava/lang/String;

    .line 695
    .line 696
    invoke-static {p0, v3, p1}, Lx/E5;->v(Lx/W1;Lx/P8;Ljava/lang/String;)Lx/Cz;

    .line 697
    .line 698
    .line 699
    move-result-object p1

    .line 700
    :goto_9
    iget-boolean v3, p0, Lcom/cochi/client/PlayerActivity;->o0:Z

    .line 701
    .line 702
    if-eqz v3, :cond_12

    .line 703
    .line 704
    iget p1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 705
    .line 706
    invoke-virtual {p0, p1, v0, v1}, Lcom/cochi/client/PlayerActivity;->L(IJ)V

    .line 707
    .line 708
    .line 709
    goto/16 :goto_b

    .line 710
    .line 711
    :cond_12
    iget-boolean v3, p0, Lcom/cochi/client/PlayerActivity;->p0:Z

    .line 712
    .line 713
    const-wide/16 v4, 0x2710

    .line 714
    .line 715
    if-eqz v3, :cond_13

    .line 716
    .line 717
    if-eqz p1, :cond_13

    .line 718
    .line 719
    iget-wide v6, p1, Lx/Cz;->e:J

    .line 720
    .line 721
    cmp-long v3, v6, v4

    .line 722
    .line 723
    if-ltz v3, :cond_13

    .line 724
    .line 725
    iget p1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 726
    .line 727
    invoke-virtual {p0, p1, v6, v7}, Lcom/cochi/client/PlayerActivity;->L(IJ)V

    .line 728
    .line 729
    .line 730
    goto/16 :goto_b

    .line 731
    .line 732
    :cond_13
    if-eqz p1, :cond_15

    .line 733
    .line 734
    iget-wide v6, p1, Lx/Cz;->e:J

    .line 735
    .line 736
    cmp-long v3, v6, v4

    .line 737
    .line 738
    if-ltz v3, :cond_15

    .line 739
    .line 740
    new-instance v3, Lx/n1;

    .line 741
    .line 742
    invoke-direct {v3, p0}, Lx/n1;-><init>(Landroid/content/Context;)V

    .line 743
    .line 744
    .line 745
    iget-object v4, p1, Lx/Cz;->c:Ljava/lang/String;

    .line 746
    .line 747
    invoke-virtual {v3, v4}, Lx/n1;->setTitle(Ljava/lang/CharSequence;)Lx/n1;

    .line 748
    .line 749
    .line 750
    move-result-object v3

    .line 751
    new-instance v4, Ljava/lang/StringBuilder;

    .line 752
    .line 753
    const-string v5, "\u00bfQuer\u00e9s continuar desde "

    .line 754
    .line 755
    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 756
    .line 757
    .line 758
    const-wide/16 v8, 0x3e8

    .line 759
    .line 760
    div-long/2addr v6, v8

    .line 761
    invoke-static {v0, v1, v6, v7}, Ljava/lang/Math;->max(JJ)J

    .line 762
    .line 763
    .line 764
    move-result-wide v5

    .line 765
    const-wide/16 v7, 0xe10

    .line 766
    .line 767
    div-long v9, v5, v7

    .line 768
    .line 769
    rem-long v7, v5, v7

    .line 770
    .line 771
    const-wide/16 v11, 0x3c

    .line 772
    .line 773
    div-long/2addr v7, v11

    .line 774
    rem-long/2addr v5, v11

    .line 775
    cmp-long v0, v9, v0

    .line 776
    .line 777
    const/4 v1, 0x2

    .line 778
    const/4 v11, 0x1

    .line 779
    if-lez v0, :cond_14

    .line 780
    .line 781
    sget-object v0, Ljava/util/Locale;->US:Ljava/util/Locale;

    .line 782
    .line 783
    invoke-static {v9, v10}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 784
    .line 785
    .line 786
    move-result-object v9

    .line 787
    invoke-static {v7, v8}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 788
    .line 789
    .line 790
    move-result-object v7

    .line 791
    invoke-static {v5, v6}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 792
    .line 793
    .line 794
    move-result-object v5

    .line 795
    const/4 v6, 0x3

    .line 796
    new-array v6, v6, [Ljava/lang/Object;

    .line 797
    .line 798
    aput-object v9, v6, v2

    .line 799
    .line 800
    aput-object v7, v6, v11

    .line 801
    .line 802
    aput-object v5, v6, v1

    .line 803
    .line 804
    const-string v1, "%d:%02d:%02d"

    .line 805
    .line 806
    invoke-static {v0, v1, v6}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    .line 807
    .line 808
    .line 809
    move-result-object v0

    .line 810
    goto :goto_a

    .line 811
    :cond_14
    sget-object v0, Ljava/util/Locale;->US:Ljava/util/Locale;

    .line 812
    .line 813
    invoke-static {v7, v8}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 814
    .line 815
    .line 816
    move-result-object v7

    .line 817
    invoke-static {v5, v6}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 818
    .line 819
    .line 820
    move-result-object v5

    .line 821
    new-array v1, v1, [Ljava/lang/Object;

    .line 822
    .line 823
    aput-object v7, v1, v2

    .line 824
    .line 825
    aput-object v5, v1, v11

    .line 826
    .line 827
    const-string v5, "%d:%02d"

    .line 828
    .line 829
    invoke-static {v0, v5, v1}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    .line 830
    .line 831
    .line 832
    move-result-object v0

    .line 833
    :goto_a
    const-string v1, "?"

    .line 834
    .line 835
    invoke-static {v4, v0, v1}, Lx/jG;->m(Ljava/lang/StringBuilder;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 836
    .line 837
    .line 838
    move-result-object v0

    .line 839
    iget-object v1, v3, Lx/n1;->a:Lx/j1;

    .line 840
    .line 841
    iput-object v0, v1, Lx/j1;->f:Ljava/lang/String;

    .line 842
    .line 843
    new-instance v0, Lx/ky;

    .line 844
    .line 845
    invoke-direct {v0, p0, p1, v2}, Lx/ky;-><init>(Lcom/cochi/client/PlayerActivity;Lx/Cz;I)V

    .line 846
    .line 847
    .line 848
    const-string v1, "Desde el inicio"

    .line 849
    .line 850
    invoke-virtual {v3, v1, v0}, Lx/n1;->a(Ljava/lang/String;Lx/ky;)V

    .line 851
    .line 852
    .line 853
    new-instance v0, Lx/ky;

    .line 854
    .line 855
    invoke-direct {v0, p0, p1, v11}, Lx/ky;-><init>(Lcom/cochi/client/PlayerActivity;Lx/Cz;I)V

    .line 856
    .line 857
    .line 858
    const-string p1, "Continuar"

    .line 859
    .line 860
    invoke-virtual {v3, p1, v0}, Lx/n1;->b(Ljava/lang/String;Landroid/content/DialogInterface$OnClickListener;)V

    .line 861
    .line 862
    .line 863
    new-instance p1, Lx/ly;

    .line 864
    .line 865
    invoke-direct {p1, p0}, Lx/ly;-><init>(Lcom/cochi/client/PlayerActivity;)V

    .line 866
    .line 867
    .line 868
    iget-object v0, v3, Lx/n1;->a:Lx/j1;

    .line 869
    .line 870
    iput-object p1, v0, Lx/j1;->k:Lx/ly;

    .line 871
    .line 872
    invoke-virtual {v3}, Lx/n1;->c()V

    .line 873
    .line 874
    .line 875
    goto :goto_b

    .line 876
    :cond_15
    iget p1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 877
    .line 878
    invoke-virtual {p0, p1, v0, v1}, Lcom/cochi/client/PlayerActivity;->L(IJ)V

    .line 879
    .line 880
    .line 881
    goto :goto_b

    .line 882
    :cond_16
    iget p1, p0, Lcom/cochi/client/PlayerActivity;->c0:I

    .line 883
    .line 884
    invoke-virtual {p0, p1, v0, v1}, Lcom/cochi/client/PlayerActivity;->L(IJ)V

    .line 885
    .line 886
    .line 887
    :goto_b
    return-void
.end method

.method public final onDestroy()V
    .locals 1

    .line 1
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->S()V

    .line 2
    .line 3
    .line 4
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->R()V

    .line 5
    .line 6
    .line 7
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 8
    .line 9
    if-eqz v0, :cond_0

    .line 10
    .line 11
    invoke-virtual {v0}, Landroid/webkit/WebView;->destroy()V

    .line 12
    .line 13
    .line 14
    :cond_0
    invoke-super {p0}, Lx/W1;->onDestroy()V

    .line 15
    .line 16
    .line 17
    return-void
.end method

.method public final onStart()V
    .locals 2

    .line 1
    invoke-super {p0}, Lx/W1;->onStart()V

    .line 2
    .line 3
    .line 4
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 5
    .line 6
    if-eqz v0, :cond_0

    .line 7
    .line 8
    invoke-virtual {v0}, Lx/Z5;->i()V

    .line 9
    .line 10
    .line 11
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 12
    .line 13
    invoke-virtual {v0}, Lx/nj;->E()I

    .line 14
    .line 15
    .line 16
    move-result v0

    .line 17
    const/4 v1, 0x2

    .line 18
    if-ne v0, v1, :cond_0

    .line 19
    .line 20
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->t()V

    .line 21
    .line 22
    .line 23
    :cond_0
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 24
    .line 25
    if-eqz v0, :cond_1

    .line 26
    .line 27
    invoke-virtual {v0}, Landroid/webkit/WebView;->onResume()V

    .line 28
    .line 29
    .line 30
    :cond_1
    return-void
.end method

.method public final onStop()V
    .locals 3

    .line 1
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->S()V

    .line 2
    .line 3
    .line 4
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->A()V

    .line 5
    .line 6
    .line 7
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 8
    .line 9
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->n0:Lx/ry;

    .line 10
    .line 11
    invoke-virtual {v0, v1}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 12
    .line 13
    .line 14
    invoke-super {p0}, Lx/W1;->onStop()V

    .line 15
    .line 16
    .line 17
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 18
    .line 19
    if-eqz v0, :cond_0

    .line 20
    .line 21
    invoke-virtual {v0}, Lx/nj;->c0()V

    .line 22
    .line 23
    .line 24
    const/4 v1, 0x1

    .line 25
    const/4 v2, 0x0

    .line 26
    invoke-virtual {v0, v1, v2}, Lx/nj;->Z(IZ)V

    .line 27
    .line 28
    .line 29
    :cond_0
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->G:Landroid/webkit/WebView;

    .line 30
    .line 31
    if-eqz v0, :cond_1

    .line 32
    .line 33
    invoke-virtual {v0}, Landroid/webkit/WebView;->onPause()V

    .line 34
    .line 35
    .line 36
    :cond_1
    return-void
.end method

.method public final s(Landroid/view/View;)V
    .locals 1

    .line 1
    if-nez p1, :cond_0

    .line 2
    .line 3
    return-void

    .line 4
    :cond_0
    const v0, 0x7f080084

    .line 5
    .line 6
    .line 7
    invoke-virtual {p0, v0}, Landroid/content/Context;->getDrawable(I)Landroid/graphics/drawable/Drawable;

    .line 8
    .line 9
    .line 10
    move-result-object v0

    .line 11
    invoke-virtual {p1, v0}, Landroid/view/View;->setForeground(Landroid/graphics/drawable/Drawable;)V

    .line 12
    .line 13
    .line 14
    return-void
.end method

.method public final t()V
    .locals 11

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 2
    .line 3
    if-eqz v0, :cond_0

    .line 4
    .line 5
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->g0:Lx/i9;

    .line 6
    .line 7
    if-eqz v0, :cond_0

    .line 8
    .line 9
    invoke-virtual {p0}, Landroid/app/Activity;->isFinishing()Z

    .line 10
    .line 11
    .line 12
    move-result v0

    .line 13
    if-nez v0, :cond_0

    .line 14
    .line 15
    invoke-virtual {p0}, Landroid/app/Activity;->isDestroyed()Z

    .line 16
    .line 17
    .line 18
    move-result v0

    .line 19
    if-nez v0, :cond_0

    .line 20
    .line 21
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->j0:Z

    .line 22
    .line 23
    if-eqz v0, :cond_1

    .line 24
    .line 25
    :cond_0
    :goto_0
    move-object v2, p0

    .line 26
    goto :goto_5

    .line 27
    :cond_1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->h0:Lx/fy;

    .line 28
    .line 29
    if-nez v0, :cond_0

    .line 30
    .line 31
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->i0:Lx/fy;

    .line 32
    .line 33
    if-eqz v0, :cond_2

    .line 34
    .line 35
    goto :goto_0

    .line 36
    :cond_2
    iget v3, p0, Lcom/cochi/client/PlayerActivity;->f0:I

    .line 37
    .line 38
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 39
    .line 40
    if-eqz v0, :cond_3

    .line 41
    .line 42
    const-wide/16 v1, 0x708

    .line 43
    .line 44
    :goto_1
    move-wide v4, v1

    .line 45
    goto :goto_2

    .line 46
    :cond_3
    const-wide/16 v1, 0x2ee0

    .line 47
    .line 48
    goto :goto_1

    .line 49
    :goto_2
    if-eqz v0, :cond_4

    .line 50
    .line 51
    const-wide/16 v0, 0x1964

    .line 52
    .line 53
    :goto_3
    move-wide v7, v0

    .line 54
    goto :goto_4

    .line 55
    :cond_4
    const-wide/16 v0, 0x61a8

    .line 56
    .line 57
    goto :goto_3

    .line 58
    :goto_4
    new-instance v1, Lx/fy;

    .line 59
    .line 60
    const/4 v6, 0x0

    .line 61
    move-object v2, p0

    .line 62
    invoke-direct/range {v1 .. v6}, Lx/fy;-><init>(Lcom/cochi/client/PlayerActivity;IJI)V

    .line 63
    .line 64
    .line 65
    move-object v0, v1

    .line 66
    move-wide v9, v4

    .line 67
    iput-object v0, v2, Lcom/cochi/client/PlayerActivity;->h0:Lx/fy;

    .line 68
    .line 69
    new-instance v1, Lx/fy;

    .line 70
    .line 71
    const/4 v6, 0x1

    .line 72
    move-wide v4, v7

    .line 73
    invoke-direct/range {v1 .. v6}, Lx/fy;-><init>(Lcom/cochi/client/PlayerActivity;IJI)V

    .line 74
    .line 75
    .line 76
    iput-object v1, v2, Lcom/cochi/client/PlayerActivity;->i0:Lx/fy;

    .line 77
    .line 78
    iget-object v1, v2, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 79
    .line 80
    invoke-virtual {v1, v0, v9, v10}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 81
    .line 82
    .line 83
    iget-object v0, v2, Lcom/cochi/client/PlayerActivity;->i0:Lx/fy;

    .line 84
    .line 85
    invoke-virtual {v1, v0, v4, v5}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 86
    .line 87
    .line 88
    :goto_5
    return-void
.end method

.method public final u()V
    .locals 4

    .line 1
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 2
    .line 3
    if-eqz v0, :cond_1

    .line 4
    .line 5
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->g0:Lx/i9;

    .line 6
    .line 7
    if-nez v0, :cond_0

    .line 8
    .line 9
    goto :goto_0

    .line 10
    :cond_0
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->B()V

    .line 11
    .line 12
    .line 13
    iget v0, p0, Lcom/cochi/client/PlayerActivity;->f0:I

    .line 14
    .line 15
    new-instance v1, Lx/u4;

    .line 16
    .line 17
    const/4 v2, 0x3

    .line 18
    invoke-direct {v1, v0, v2, p0}, Lx/u4;-><init>(IILjava/lang/Object;)V

    .line 19
    .line 20
    .line 21
    iput-object v1, p0, Lcom/cochi/client/PlayerActivity;->m0:Lx/u4;

    .line 22
    .line 23
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 24
    .line 25
    const-wide/16 v2, 0x2328

    .line 26
    .line 27
    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 28
    .line 29
    .line 30
    :cond_1
    :goto_0
    return-void
.end method

.method public final v()V
    .locals 3

    .line 1
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->F:Landroidx/media3/ui/PlayerView;

    .line 2
    .line 3
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 4
    .line 5
    invoke-virtual {v0, v1}, Landroidx/media3/ui/PlayerView;->setPlayer(Lx/cy;)V

    .line 6
    .line 7
    .line 8
    iget-boolean v0, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 9
    .line 10
    if-eqz v0, :cond_0

    .line 11
    .line 12
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->D()V

    .line 13
    .line 14
    .line 15
    :cond_0
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->F()V

    .line 16
    .line 17
    .line 18
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->U:Landroid/os/Handler;

    .line 19
    .line 20
    iget-object v1, p0, Lcom/cochi/client/PlayerActivity;->x0:Lx/ry;

    .line 21
    .line 22
    invoke-virtual {v0, v1}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 23
    .line 24
    .line 25
    invoke-virtual {p0}, Lcom/cochi/client/PlayerActivity;->H()Z

    .line 26
    .line 27
    .line 28
    move-result v2

    .line 29
    if-eqz v2, :cond_1

    .line 30
    .line 31
    iget-boolean v2, p0, Lcom/cochi/client/PlayerActivity;->Y:Z

    .line 32
    .line 33
    if-eqz v2, :cond_2

    .line 34
    .line 35
    iget-boolean v2, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 36
    .line 37
    if-nez v2, :cond_2

    .line 38
    .line 39
    :cond_1
    invoke-virtual {v0, v1}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 40
    .line 41
    .line 42
    :cond_2
    iget-object v0, p0, Lcom/cochi/client/PlayerActivity;->E:Lx/nj;

    .line 43
    .line 44
    new-instance v1, Lx/is;

    .line 45
    .line 46
    const/4 v2, 0x1

    .line 47
    invoke-direct {v1, v2, p0}, Lx/is;-><init>(ILjava/lang/Object;)V

    .line 48
    .line 49
    .line 50
    iget-object v0, v0, Lx/nj;->m:Lx/mr;

    .line 51
    .line 52
    invoke-virtual {v0, v1}, Lx/mr;->a(Ljava/lang/Object;)V

    .line 53
    .line 54
    .line 55
    return-void
.end method

.method public final x(Lx/i9;Ljava/lang/String;)Lx/Je;
    .locals 7

    .line 1
    const/4 v0, 0x0

    .line 2
    if-nez p1, :cond_0

    .line 3
    .line 4
    move-object p1, v0

    .line 5
    goto :goto_0

    .line 6
    :cond_0
    iget-object p1, p1, Lx/i9;->g:Ljava/util/Map;

    .line 7
    .line 8
    :goto_0
    sget-object v1, Lx/Mm;->a:Ljava/util/Set;

    .line 9
    .line 10
    new-instance v1, Ljava/util/LinkedHashMap;

    .line 11
    .line 12
    invoke-direct {v1}, Ljava/util/LinkedHashMap;-><init>()V

    .line 13
    .line 14
    .line 15
    const-string v2, "Accept"

    .line 16
    .line 17
    const-string v3, "*/*"

    .line 18
    .line 19
    invoke-static {v1, v2, v3}, Lx/Mm;->b(Ljava/util/LinkedHashMap;Ljava/lang/String;Ljava/lang/String;)V

    .line 20
    .line 21
    .line 22
    const-string v2, "Accept-Language"

    .line 23
    .line 24
    const-string v3, "es-AR,es;q=0.9,en;q=0.7"

    .line 25
    .line 26
    invoke-static {v1, v2, v3}, Lx/Mm;->b(Ljava/util/LinkedHashMap;Ljava/lang/String;Ljava/lang/String;)V

    .line 27
    .line 28
    .line 29
    const-string v2, "User-Agent"

    .line 30
    .line 31
    const-string v3, "Mozilla/5.0 (Linux; Android 13; CO-CHI) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36 CO-CHI/0.22.14"

    .line 32
    .line 33
    invoke-static {v1, v2, v3}, Lx/Mm;->b(Ljava/util/LinkedHashMap;Ljava/lang/String;Ljava/lang/String;)V

    .line 34
    .line 35
    .line 36
    const-string v2, ""

    .line 37
    .line 38
    if-nez p2, :cond_1

    .line 39
    .line 40
    move-object p2, v2

    .line 41
    goto :goto_1

    .line 42
    :cond_1
    :try_start_0
    invoke-virtual {p2}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 43
    .line 44
    .line 45
    move-result-object p2

    .line 46
    :goto_1
    invoke-static {p2}, Ljava/net/URI;->create(Ljava/lang/String;)Ljava/net/URI;

    .line 47
    .line 48
    .line 49
    move-result-object p2

    .line 50
    invoke-virtual {p2}, Ljava/net/URI;->getHost()Ljava/lang/String;

    .line 51
    .line 52
    .line 53
    move-result-object p2

    .line 54
    if-nez p2, :cond_2

    .line 55
    .line 56
    goto :goto_2

    .line 57
    :cond_2
    sget-object v3, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    .line 58
    .line 59
    invoke-virtual {p2, v3}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    .line 60
    .line 61
    .line 62
    move-result-object v2
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 63
    :catch_0
    :goto_2
    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    .line 64
    .line 65
    .line 66
    move-result p2

    .line 67
    if-eqz p2, :cond_3

    .line 68
    .line 69
    move-object p2, v0

    .line 70
    goto :goto_3

    .line 71
    :cond_3
    sget-object p2, Lx/Mm;->b:Ljava/util/concurrent/ConcurrentHashMap;

    .line 72
    .line 73
    invoke-virtual {p2, v2}, Ljava/util/concurrent/ConcurrentHashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    .line 74
    .line 75
    .line 76
    move-result-object p2

    .line 77
    check-cast p2, Lx/Lm;

    .line 78
    .line 79
    :goto_3
    if-eqz p2, :cond_6

    .line 80
    .line 81
    monitor-enter p2

    .line 82
    :try_start_1
    iget-object v2, p2, Lx/Lm;->a:Ljava/util/LinkedHashMap;

    .line 83
    .line 84
    invoke-virtual {v2}, Ljava/util/LinkedHashMap;->values()Ljava/util/Collection;

    .line 85
    .line 86
    .line 87
    move-result-object v2

    .line 88
    invoke-interface {v2}, Ljava/util/Collection;->iterator()Ljava/util/Iterator;

    .line 89
    .line 90
    .line 91
    move-result-object v2

    .line 92
    :cond_4
    :goto_4
    invoke-interface {v2}, Ljava/util/Iterator;->hasNext()Z

    .line 93
    .line 94
    .line 95
    move-result v3

    .line 96
    if-eqz v3, :cond_5

    .line 97
    .line 98
    invoke-interface {v2}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    .line 99
    .line 100
    .line 101
    move-result-object v3

    .line 102
    check-cast v3, Lx/Km;

    .line 103
    .line 104
    invoke-virtual {v3}, Lx/Km;->a()Ljava/lang/String;

    .line 105
    .line 106
    .line 107
    move-result-object v4

    .line 108
    if-eqz v4, :cond_4

    .line 109
    .line 110
    iget-object v3, v3, Lx/Km;->a:Ljava/lang/String;

    .line 111
    .line 112
    invoke-static {v1, v3, v4}, Lx/Mm;->b(Ljava/util/LinkedHashMap;Ljava/lang/String;Ljava/lang/String;)V

    .line 113
    .line 114
    .line 115
    goto :goto_4

    .line 116
    :catchall_0
    move-exception p1

    .line 117
    goto :goto_5

    .line 118
    :cond_5
    monitor-exit p2

    .line 119
    goto :goto_6

    .line 120
    :goto_5
    monitor-exit p2
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    .line 121
    throw p1

    .line 122
    :cond_6
    :goto_6
    if-eqz p1, :cond_a

    .line 123
    .line 124
    invoke-interface {p1}, Ljava/util/Map;->entrySet()Ljava/util/Set;

    .line 125
    .line 126
    .line 127
    move-result-object p1

    .line 128
    invoke-interface {p1}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    .line 129
    .line 130
    .line 131
    move-result-object p1

    .line 132
    :cond_7
    :goto_7
    invoke-interface {p1}, Ljava/util/Iterator;->hasNext()Z

    .line 133
    .line 134
    .line 135
    move-result p2

    .line 136
    if-eqz p2, :cond_a

    .line 137
    .line 138
    invoke-interface {p1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    .line 139
    .line 140
    .line 141
    move-result-object p2

    .line 142
    check-cast p2, Ljava/util/Map$Entry;

    .line 143
    .line 144
    invoke-interface {p2}, Ljava/util/Map$Entry;->getKey()Ljava/lang/Object;

    .line 145
    .line 146
    .line 147
    move-result-object v2

    .line 148
    check-cast v2, Ljava/lang/String;

    .line 149
    .line 150
    if-nez v2, :cond_8

    .line 151
    .line 152
    const-string v2, ""

    .line 153
    .line 154
    goto :goto_8

    .line 155
    :cond_8
    invoke-virtual {v2}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 156
    .line 157
    .line 158
    move-result-object v2

    .line 159
    :goto_8
    invoke-interface {p2}, Ljava/util/Map$Entry;->getValue()Ljava/lang/Object;

    .line 160
    .line 161
    .line 162
    move-result-object p2

    .line 163
    check-cast p2, Ljava/lang/String;

    .line 164
    .line 165
    if-nez p2, :cond_9

    .line 166
    .line 167
    const-string p2, ""

    .line 168
    .line 169
    goto :goto_9

    .line 170
    :cond_9
    invoke-virtual {p2}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 171
    .line 172
    .line 173
    move-result-object p2

    .line 174
    :goto_9
    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    .line 175
    .line 176
    .line 177
    move-result v3

    .line 178
    if-nez v3, :cond_7

    .line 179
    .line 180
    invoke-virtual {p2}, Ljava/lang/String;->isEmpty()Z

    .line 181
    .line 182
    .line 183
    move-result v3

    .line 184
    if-nez v3, :cond_7

    .line 185
    .line 186
    invoke-static {v1, v2, p2}, Lx/Mm;->b(Ljava/util/LinkedHashMap;Ljava/lang/String;Ljava/lang/String;)V

    .line 187
    .line 188
    .line 189
    goto :goto_7

    .line 190
    :cond_a
    invoke-static {v1}, Ljava/util/Collections;->unmodifiableMap(Ljava/util/Map;)Ljava/util/Map;

    .line 191
    .line 192
    .line 193
    move-result-object p1

    .line 194
    new-instance p2, Ljava/util/LinkedHashMap;

    .line 195
    .line 196
    invoke-direct {p2, p1}, Ljava/util/LinkedHashMap;-><init>(Ljava/util/Map;)V

    .line 197
    .line 198
    .line 199
    const-string p1, "User-Agent"

    .line 200
    .line 201
    new-instance v1, Ljava/util/ArrayList;

    .line 202
    .line 203
    invoke-virtual {p2}, Ljava/util/LinkedHashMap;->keySet()Ljava/util/Set;

    .line 204
    .line 205
    .line 206
    move-result-object v2

    .line 207
    invoke-direct {v1, v2}, Ljava/util/ArrayList;-><init>(Ljava/util/Collection;)V

    .line 208
    .line 209
    .line 210
    invoke-virtual {v1}, Ljava/util/ArrayList;->size()I

    .line 211
    .line 212
    .line 213
    move-result v2

    .line 214
    const/4 v3, 0x0

    .line 215
    move v4, v3

    .line 216
    :cond_b
    if-ge v4, v2, :cond_c

    .line 217
    .line 218
    invoke-virtual {v1, v4}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    .line 219
    .line 220
    .line 221
    move-result-object v5

    .line 222
    add-int/lit8 v4, v4, 0x1

    .line 223
    .line 224
    check-cast v5, Ljava/lang/String;

    .line 225
    .line 226
    invoke-virtual {v5, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    .line 227
    .line 228
    .line 229
    move-result v6

    .line 230
    if-eqz v6, :cond_b

    .line 231
    .line 232
    invoke-interface {p2, v5}, Ljava/util/Map;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    .line 233
    .line 234
    .line 235
    move-result-object p1

    .line 236
    move-object v0, p1

    .line 237
    check-cast v0, Ljava/lang/String;

    .line 238
    .line 239
    :cond_c
    if-eqz v0, :cond_d

    .line 240
    .line 241
    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    .line 242
    .line 243
    .line 244
    move-result-object p1

    .line 245
    invoke-virtual {p1}, Ljava/lang/String;->isEmpty()Z

    .line 246
    .line 247
    .line 248
    move-result p1

    .line 249
    if-eqz p1, :cond_e

    .line 250
    .line 251
    :cond_d
    const-string v0, "CO-CHI/0.23.93"

    .line 252
    .line 253
    :cond_e
    iget-boolean p1, p0, Lcom/cochi/client/PlayerActivity;->X:Z

    .line 254
    .line 255
    if-eqz p1, :cond_f

    .line 256
    .line 257
    const/16 v1, 0x9c4

    .line 258
    .line 259
    goto :goto_a

    .line 260
    :cond_f
    const/16 v1, 0x1b58

    .line 261
    .line 262
    :goto_a
    if-eqz p1, :cond_10

    .line 263
    .line 264
    const/16 p1, 0x1194

    .line 265
    .line 266
    goto :goto_b

    .line 267
    :cond_10
    const/16 p1, 0x2ee0

    .line 268
    .line 269
    :goto_b
    new-instance v2, Lx/Je;

    .line 270
    .line 271
    invoke-direct {v2, v3}, Lx/Je;-><init>(I)V

    .line 272
    .line 273
    .line 274
    iput v1, v2, Lx/Je;->h:I

    .line 275
    .line 276
    iput p1, v2, Lx/Je;->i:I

    .line 277
    .line 278
    const/4 p1, 0x1

    .line 279
    iput-boolean p1, v2, Lx/Je;->j:Z

    .line 280
    .line 281
    iput-object v0, v2, Lx/Je;->l:Ljava/lang/Object;

    .line 282
    .line 283
    invoke-virtual {p2}, Ljava/util/AbstractMap;->isEmpty()Z

    .line 284
    .line 285
    .line 286
    move-result p1

    .line 287
    if-nez p1, :cond_11

    .line 288
    .line 289
    invoke-virtual {v2, p2}, Lx/Je;->c(Ljava/util/LinkedHashMap;)V

    .line 290
    .line 291
    .line 292
    :cond_11
    return-object v2
.end method

.method public final z(Lx/ef;)Lx/nj;
    .locals 10

    .line 1
    new-instance v9, Ljava/util/HashMap;

    .line 2
    .line 3
    invoke-direct {v9}, Ljava/util/HashMap;-><init>()V

    .line 4
    .line 5
    .line 6
    sget-object v0, Lx/Py;->c:Lx/Py;

    .line 7
    .line 8
    iget-object v0, v0, Lx/Py;->a:Ljava/lang/String;

    .line 9
    .line 10
    const/high16 v1, 0x8980000

    .line 11
    .line 12
    invoke-static {v1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 13
    .line 14
    .line 15
    move-result-object v1

    .line 16
    invoke-virtual {v9, v0, v1}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 17
    .line 18
    .line 19
    const/16 v0, 0x3e8

    .line 20
    .line 21
    const/4 v1, 0x0

    .line 22
    const-string v2, "bufferForPlaybackMs"

    .line 23
    .line 24
    const-string v3, "0"

    .line 25
    .line 26
    invoke-static {v0, v1, v2, v3}, Lx/af;->a(IILjava/lang/String;Ljava/lang/String;)V

    .line 27
    .line 28
    .line 29
    const/16 v6, 0x1388

    .line 30
    .line 31
    const-string v4, "bufferForPlaybackAfterRebufferMs"

    .line 32
    .line 33
    invoke-static {v6, v1, v4, v3}, Lx/af;->a(IILjava/lang/String;Ljava/lang/String;)V

    .line 34
    .line 35
    .line 36
    move-object v1, v2

    .line 37
    const/16 v2, 0x4e20

    .line 38
    .line 39
    const-string v3, "minBufferMs"

    .line 40
    .line 41
    invoke-static {v2, v0, v3, v1}, Lx/af;->a(IILjava/lang/String;Ljava/lang/String;)V

    .line 42
    .line 43
    .line 44
    invoke-static {v2, v6, v3, v4}, Lx/af;->a(IILjava/lang/String;Ljava/lang/String;)V

    .line 45
    .line 46
    .line 47
    const-string v0, "maxBufferMs"

    .line 48
    .line 49
    const v4, 0xea60

    .line 50
    .line 51
    .line 52
    invoke-static {v4, v2, v0, v3}, Lx/af;->a(IILjava/lang/String;Ljava/lang/String;)V

    .line 53
    .line 54
    .line 55
    new-instance v1, Lx/Sd;

    .line 56
    .line 57
    invoke-direct {v1}, Lx/Sd;-><init>()V

    .line 58
    .line 59
    .line 60
    new-instance v0, Lx/af;

    .line 61
    .line 62
    const/4 v8, 0x1

    .line 63
    move v3, v2

    .line 64
    move v5, v4

    .line 65
    move v7, v6

    .line 66
    invoke-direct/range {v0 .. v9}, Lx/af;-><init>(Lx/Sd;IIIIIIZLjava/util/Map;)V

    .line 67
    .line 68
    .line 69
    new-instance v1, Lx/Zi;

    .line 70
    .line 71
    invoke-direct {v1, p0}, Lx/Zi;-><init>(Lx/W1;)V

    .line 72
    .line 73
    .line 74
    iget-boolean v2, v1, Lx/Zi;->z:Z

    .line 75
    .line 76
    const/4 v3, 0x1

    .line 77
    xor-int/2addr v2, v3

    .line 78
    invoke-static {v2}, Lx/QK;->z(Z)V

    .line 79
    .line 80
    .line 81
    new-instance v2, Lx/s4;

    .line 82
    .line 83
    const/4 v4, 0x3

    .line 84
    invoke-direct {v2, v4, p1}, Lx/s4;-><init>(ILjava/lang/Object;)V

    .line 85
    .line 86
    .line 87
    iput-object v2, v1, Lx/Zi;->d:Lx/fI;

    .line 88
    .line 89
    iget-boolean p1, v1, Lx/Zi;->z:Z

    .line 90
    .line 91
    xor-int/2addr p1, v3

    .line 92
    invoke-static {p1}, Lx/QK;->z(Z)V

    .line 93
    .line 94
    .line 95
    new-instance p1, Lx/s4;

    .line 96
    .line 97
    const/4 v2, 0x2

    .line 98
    invoke-direct {p1, v2, v0}, Lx/s4;-><init>(ILjava/lang/Object;)V

    .line 99
    .line 100
    .line 101
    iput-object p1, v1, Lx/Zi;->f:Lx/fI;

    .line 102
    .line 103
    iget-boolean p1, v1, Lx/Zi;->z:Z

    .line 104
    .line 105
    xor-int/2addr p1, v3

    .line 106
    invoke-static {p1}, Lx/QK;->z(Z)V

    .line 107
    .line 108
    .line 109
    const-wide/16 v4, 0x2710

    .line 110
    .line 111
    iput-wide v4, v1, Lx/Zi;->o:J

    .line 112
    .line 113
    iget-boolean p1, v1, Lx/Zi;->z:Z

    .line 114
    .line 115
    xor-int/2addr p1, v3

    .line 116
    invoke-static {p1}, Lx/QK;->z(Z)V

    .line 117
    .line 118
    .line 119
    iput-wide v4, v1, Lx/Zi;->p:J

    .line 120
    .line 121
    iget-boolean p1, v1, Lx/Zi;->z:Z

    .line 122
    .line 123
    xor-int/2addr p1, v3

    .line 124
    invoke-static {p1}, Lx/QK;->z(Z)V

    .line 125
    .line 126
    .line 127
    iput-boolean v3, v1, Lx/Zi;->z:Z

    .line 128
    .line 129
    new-instance p1, Lx/nj;

    .line 130
    .line 131
    invoke-direct {p1, v1}, Lx/nj;-><init>(Lx/Zi;)V

    .line 132
    .line 133
    .line 134
    return-object p1
.end method
