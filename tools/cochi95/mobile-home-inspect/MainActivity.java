package com.cochi.client;

import android.app.UiModeManager;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.ColorStateList;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.InputType;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.media3.common.MediaItem;
import androidx.media3.common.Player;
import androidx.media3.common.PlaybackException;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.PlayerView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;

import org.json.JSONObject;
import org.json.JSONArray;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private View cardContinue;
    private TextView continueLabel;
    private TextView accountStatus;
    private TextView accountStatusTitle;
    private TextView expirationDaysBadge;

    // Inicio premium exclusivo para Android TV / TV Box.
    private boolean tvHomeMode;
    private TvHomeContentAdapter homeLiveAdapter;
    private TvHomeContentAdapter homeMoviesAdapter;
    private TvHomeContentAdapter homeSeriesAdapter;
    private TvHomeContinueAdapter homeContinueAdapter;
    private LinearLayout homeContinueSection;
    private LinearLayout homeLiveSection;
    private LinearLayout homeMoviesSection;
    private LinearLayout homeSeriesSection;
    private ProgressBar tvHomeLoading;
    private TextView tvHomeStatus;
    private ImageView heroImage;
    private PlayerView heroVideo;
    private WebView heroYoutube;
    private View heroScrim;
    private ExoPlayer heroVideoPlayer;
    private boolean managedBannerActive;
    private final Handler bannerRotationHandler = new Handler(Looper.getMainLooper());
    private final List<String> managedBannerMedia = new ArrayList<>();
    private int managedBannerMediaIndex = 0;
    private int managedBannerRotationMs = 8000;
    private JSONObject managedBannerConfig;
    private final Runnable bannerRotationRunnable = new Runnable() {
        @Override public void run() {
            if (!managedBannerActive || managedBannerMedia.size() <= 1) return;
            managedBannerMediaIndex = (managedBannerMediaIndex + 1) % managedBannerMedia.size();
            applyManagedBannerMedia();
            bannerRotationHandler.postDelayed(this, managedBannerRotationMs);
        }
    };
    private String managedBannerTargetSource = "";
    private String managedBannerTargetId = "";
    private TextView heroEyebrow;
    private TextView heroTitle;
    private TextView heroDescription;
    private TextView heroMeta;
    private MaterialButton heroPlayButton;
    private MaterialButton heroExploreButton;
    private ScrollView tvHomeScroll;
    private TvHomeContentAdapter.HomeItem selectedHomeItem;
    private List<Channel> homeTv1 = new ArrayList<>();
    private List<Channel> homeTv2 = new ArrayList<>();
    private List<Channel> homeMovies = new ArrayList<>();
    private List<Channel> homeSeries = new ArrayList<>();
    private int homeLoadsRemaining;
    private int homeLoadSuccessCount;
    private int homeLoadErrorCount;
    private boolean heroUserSelected;
    private int heroInitialPriority;
    private boolean sectionLaunchInProgress;
    private boolean contentRefreshInProgress;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!SessionManager.isLoggedIn(this)) {
            openLogin();
            return;
        }
        if (SessionManager.isExpired(this)) {
            openExpired();
            return;
        }

        tvHomeMode = isTelevision();
        setContentView(tvHomeMode ? R.layout.activity_main_tv : R.layout.activity_main);
        if (tvHomeMode) applyManagedTheme();

        TextView welcome = findViewById(R.id.welcomeText);
        welcome.setText(SessionManager.clientName(this));

        accountStatus = findViewById(R.id.accountStatus);
        accountStatusTitle = findViewById(R.id.accountStatusTitle);
        expirationDaysBadge = findViewById(R.id.expirationDaysBadge);
        refreshAccountStatus();

        findViewById(R.id.logoutButton).setOnClickListener(v -> showUnlinkConfirmation());

        if (tvHomeMode) {
            applyTvBlackBackground();
            setupTvHome();
            return;
        }

        // Precarga Series en segundo plano sin tocar las JSON remotas.
        CatalogRepository.prefetchSeries(this);

        setupCard(R.id.cardTv1, v -> openSourceIfEnabled(CatalogSource.TV1, () -> openTv(CatalogSource.TV1, false)));
        setupCard(R.id.cardTv2, v -> openSourceIfEnabled(CatalogSource.TV2, () -> openTv(CatalogSource.TV2, false)));
        setupCard(R.id.cardMovies, v -> openSourceIfEnabled(CatalogSource.MOVIES, () -> openCatalog(CatalogSource.MOVIES)));
        setupCard(R.id.cardSeries, v -> openSourceIfEnabled(CatalogSource.SERIES, () -> openCatalog(CatalogSource.SERIES)));
        setupCard(R.id.cardAdult, v -> openAdultIfEnabled());

        cardContinue = findViewById(R.id.cardContinue);
        continueLabel = findViewById(R.id.continueLabel);
        setupCard(R.id.cardContinue, v -> startActivity(
                new Intent(this, ContinueWatchingActivity.class)));
        refreshGlobalSourceVisibility(false);
    }

    /**
     * v0.23.37: fuerza el fondo negro real en Android TV.
     * Se aplica también en runtime porque algunos TV Box/OEM pueden conservar el color
     * de ventana o el tint del tema aunque el XML use un drawable oscuro.
     */
    private void applyTvBlackBackground() {
        int bg = ManagedTheme.background(this);
        getWindow().setStatusBarColor(bg);
        getWindow().setNavigationBarColor(bg);
        getWindow().getDecorView().setBackgroundColor(bg);

        View root = findViewById(R.id.tvHomeRoot);
        if (root != null) root.setBackgroundResource(R.drawable.cochi_tv_dark_background);

        View scroll = findViewById(R.id.tvHomeScroll);
        if (scroll != null) scroll.setBackgroundColor(bg);

        View sidebar = findViewById(R.id.tvHomeSidebar);
        if (sidebar != null) {
            GradientDrawable gd = new GradientDrawable(); gd.setColor(ManagedTheme.button(this)); gd.setCornerRadius(dp(20)); gd.setStroke(dp(1), ManagedTheme.border(this)); sidebar.setBackground(gd);
        }
    }

    private void applyManagedTheme() {
        if (!tvHomeMode) return;
        int bg=ManagedTheme.background(this), primary=ManagedTheme.primary(this), selection=ManagedTheme.selection(this), button=ManagedTheme.button(this), border=ManagedTheme.border(this), text=ManagedTheme.text(this), secondary=ManagedTheme.secondary(this);
        getWindow().setStatusBarColor(bg); getWindow().setNavigationBarColor(bg); getWindow().getDecorView().setBackgroundColor(bg);
        View root=findViewById(R.id.tvHomeRoot); if(root!=null)root.setBackgroundColor(bg);
        View scroll=findViewById(R.id.tvHomeScroll); if(scroll!=null)scroll.setBackgroundColor(bg);
        View sidebar=findViewById(R.id.tvHomeSidebar); if(sidebar!=null){GradientDrawable g=new GradientDrawable();g.setColor(button);g.setCornerRadius(dp(20));g.setStroke(dp(1),border);sidebar.setBackground(g);}
        TextView brand=findViewById(R.id.tvBrandText); if(brand!=null)brand.setTextColor(primary);
        TextView welcome=findViewById(R.id.welcomeText); if(welcome!=null)welcome.setTextColor(secondary);
        if(accountStatusTitle!=null)accountStatusTitle.setTextColor(primary); if(accountStatus!=null)accountStatus.setTextColor(secondary);
        int[] ids={R.id.tvNavHome,R.id.tvNavTv1,R.id.tvNavTv2,R.id.tvNavMovies,R.id.tvNavSeries,R.id.tvNavRefresh,R.id.tvNavAdult,R.id.logoutButton};
        for(int id:ids){View v=findViewById(id);if(v instanceof MaterialButton){MaterialButton b=(MaterialButton)v;b.setBackgroundTintList(ColorStateList.valueOf(id==R.id.tvNavHome?selection:button));b.setStrokeColor(ColorStateList.valueOf(id==R.id.tvNavHome?primary:border));b.setTextColor(text);b.setIconTint(ColorStateList.valueOf(primary));}}
        if(heroEyebrow!=null)heroEyebrow.setTextColor(primary);if(heroTitle!=null)heroTitle.setTextColor(text);if(heroDescription!=null)heroDescription.setTextColor(secondary);if(heroMeta!=null)heroMeta.setTextColor(secondary);
        if(heroPlayButton!=null){heroPlayButton.setBackgroundTintList(ColorStateList.valueOf(selection));heroPlayButton.setStrokeColor(ColorStateList.valueOf(primary));heroPlayButton.setTextColor(text);}
        if(heroExploreButton!=null){heroExploreButton.setBackgroundTintList(ColorStateList.valueOf(button));heroExploreButton.setStrokeColor(ColorStateList.valueOf(border));heroExploreButton.setTextColor(text);}
    }

    private void setupTvHome() {
        tvHomeScroll = findViewById(R.id.tvHomeScroll);
        tvHomeLoading = findViewById(R.id.tvHomeLoading);
        tvHomeStatus = findViewById(R.id.tvHomeStatus);
        homeContinueSection = findViewById(R.id.homeContinueSection);
        homeLiveSection = findViewById(R.id.homeLiveSection);
        homeMoviesSection = findViewById(R.id.homeMoviesSection);
        homeSeriesSection = findViewById(R.id.homeSeriesSection);
        heroImage = findViewById(R.id.heroImage);
        heroVideo = findViewById(R.id.heroVideo);
        heroYoutube = findViewById(R.id.heroYoutube);
        heroScrim = findViewById(R.id.heroScrim);
        heroEyebrow = findViewById(R.id.heroEyebrow);
        heroTitle = findViewById(R.id.heroTitle);
        heroDescription = findViewById(R.id.heroDescription);
        heroMeta = findViewById(R.id.heroMeta);
        heroPlayButton = findViewById(R.id.heroPlayButton);
        heroExploreButton = findViewById(R.id.heroExploreButton);
        applyManagedTheme();

        // v0.23.74: Inicio 60/30/10. Banner 60%, Continuar viendo 30% y
        // 10% inferior reservado como zona segura contra overscan/recorte del TV.
        View heroCard = findViewById(R.id.heroCard);
        if (tvHomeScroll != null && heroCard != null) {
            tvHomeScroll.post(() -> {
                int available = tvHomeScroll.getHeight() - dp(44);
                int target = Math.round(available * 0.60f);
                target = Math.max(dp(300), Math.min(dp(390), target));
                android.view.ViewGroup.LayoutParams lp = heroCard.getLayoutParams();
                lp.height = target;
                heroCard.setLayoutParams(lp);
            });
        }

        RecyclerView continueRecycler = findViewById(R.id.homeContinueRecycler);
        RecyclerView liveRecycler = findViewById(R.id.homeLiveRecycler);
        RecyclerView moviesRecycler = findViewById(R.id.homeMoviesRecycler);
        RecyclerView seriesRecycler = findViewById(R.id.homeSeriesRecycler);

        setupHorizontalRecycler(continueRecycler, 8);

        homeContinueAdapter = new TvHomeContinueAdapter(this,
                entry -> startActivity(new Intent(this, ContinueWatchingActivity.class)));
        continueRecycler.setAdapter(homeContinueAdapter);

        TvHomeContentAdapter.Listener contentListener = new TvHomeContentAdapter.Listener() {
            @Override public void onClick(TvHomeContentAdapter.HomeItem item) {
                openHomeItem(item);
            }

            @Override public void onFocus(TvHomeContentAdapter.HomeItem item) {
                // Cuando Administración fija un banner, navegar por las filas no debe
                // reemplazarlo con canales, películas o series. El banner sólo cambia
                // cuando cambia su configuración desde el panel.
                if (managedBannerActive) return;
                heroUserSelected = true;
                applyHero(item);
            }
        };

        homeLiveAdapter = new TvHomeContentAdapter(
                this, TvHomeContentAdapter.Style.LIVE, contentListener);
        homeMoviesAdapter = new TvHomeContentAdapter(
                this, TvHomeContentAdapter.Style.POSTER, contentListener);
        homeSeriesAdapter = new TvHomeContentAdapter(
                this, TvHomeContentAdapter.Style.POSTER, contentListener);

        setupTvNavButton(R.id.tvNavHome, true, v -> {
            if (tvHomeScroll != null) tvHomeScroll.smoothScrollTo(0, 0);
        });
        setupTvNavButton(R.id.tvNavTv1, false, v -> openSourceIfEnabled(CatalogSource.TV1, () -> openTv(CatalogSource.TV1, false)));
        setupTvNavButton(R.id.tvNavTv2, false, v -> openSourceIfEnabled(CatalogSource.TV2, () -> openTv(CatalogSource.TV2, false)));
        setupTvNavButton(R.id.tvNavMovies, false, v -> openSourceIfEnabled(CatalogSource.MOVIES, () -> openCatalog(CatalogSource.MOVIES)));
        setupTvNavButton(R.id.tvNavSeries, false, v -> openSourceIfEnabled(CatalogSource.SERIES, () -> openCatalog(CatalogSource.SERIES)));
        setupTvNavButton(R.id.tvNavRefresh, false, v -> refreshTvContent());
        setupTvNavButton(R.id.tvNavAdult, false, v -> openAdultIfEnabled());
        setupHeroButton(heroPlayButton);
        setupHeroButton(heroExploreButton);

        heroPlayButton.setOnClickListener(v -> {
            if (managedBannerActive) { openManagedBannerTarget(); return; }
            if (selectedHomeItem != null) openHomeItem(selectedHomeItem);
        });
        heroExploreButton.setOnClickListener(v -> {
            if (managedBannerActive) { openManagedBannerSection(); return; }
            if (selectedHomeItem == null) {
                openCatalog(CatalogSource.MOVIES);
            } else {
                exploreSource(selectedHomeItem.source);
            }
        });

        refreshContinueHome();
        applyGlobalSourceVisibility();
        refreshGlobalSourceVisibility(false);

        View first = findViewById(R.id.tvNavHome);
        first.post(first::requestFocus);
    }

    private void setupHorizontalRecycler(RecyclerView recycler, int cacheSize) {
        if (recycler == null) return;
        recycler.setLayoutManager(new LinearLayoutManager(
                this, LinearLayoutManager.HORIZONTAL, false));
        recycler.setHasFixedSize(true);
        recycler.setItemViewCacheSize(cacheSize);
    }

    private void loadTvHomeData() {
        // v0.23.69: no descargar catálogos completos para duplicarlos en Inicio.
        // El menú lateral ya es la entrada a TV1/TV2/Películas/Series.
        if (tvHomeMode) {
            if (tvHomeLoading != null) tvHomeLoading.setVisibility(View.GONE);
            if (tvHomeStatus != null) tvHomeStatus.setVisibility(View.GONE);
            refreshContinueHome();
            return;
        }
        int enabledCount = 0;
        if (SourceVisibility.isVisible(CatalogSource.TV1)) enabledCount++;
        if (SourceVisibility.isVisible(CatalogSource.TV2)) enabledCount++;
        if (SourceVisibility.isVisible(CatalogSource.MOVIES)) enabledCount++;
        if (SourceVisibility.isVisible(CatalogSource.SERIES)) enabledCount++;
        homeLoadsRemaining = enabledCount;
        homeLoadSuccessCount = 0;
        homeLoadErrorCount = 0;
        tvHomeLoading.setVisibility(enabledCount > 0 ? View.VISIBLE : View.GONE);
        tvHomeStatus.setVisibility(View.GONE);

        if (!SourceVisibility.isVisible(CatalogSource.TV1)) homeTv1 = new ArrayList<>();
        if (!SourceVisibility.isVisible(CatalogSource.TV2)) homeTv2 = new ArrayList<>();
        if (!SourceVisibility.isVisible(CatalogSource.MOVIES)) {
            homeMovies = new ArrayList<>();
            homeMoviesAdapter.submitList(new ArrayList<>());
            homeMoviesSection.setVisibility(View.GONE);
        }
        if (!SourceVisibility.isVisible(CatalogSource.SERIES)) {
            homeSeries = new ArrayList<>();
            homeSeriesAdapter.submitList(new ArrayList<>());
            homeSeriesSection.setVisibility(View.GONE);
        }
        updateHomeLiveRow();

        if (SourceVisibility.isVisible(CatalogSource.TV1)) loadHomeSource(CatalogSource.TV1, items -> {
            homeTv1 = filterNonAdult(items);
            updateHomeLiveRow();
        });
        if (SourceVisibility.isVisible(CatalogSource.TV2)) loadHomeSource(CatalogSource.TV2, items -> {
            homeTv2 = filterNonAdult(items);
            updateHomeLiveRow();
        });
        if (SourceVisibility.isVisible(CatalogSource.MOVIES)) loadHomeSource(CatalogSource.MOVIES, items -> {
            homeMovies = filterNonAdult(items);
            List<TvHomeContentAdapter.HomeItem> row = wrap(CatalogSource.MOVIES, homeMovies, 16);
            homeMoviesAdapter.submitList(row);
            homeMoviesSection.setVisibility(row.isEmpty() ? View.GONE : View.VISIBLE);
            if (!row.isEmpty()) {
                maybeSetInitialHero(row.get(0));
                ImageLoader.prefetch(this, homeMovies, 8);
            }
        });
        if (SourceVisibility.isVisible(CatalogSource.SERIES)) loadHomeSource(CatalogSource.SERIES, items -> {
            homeSeries = filterNonAdult(items);
            List<TvHomeContentAdapter.HomeItem> row = wrap(CatalogSource.SERIES, homeSeries, 16);
            homeSeriesAdapter.submitList(row);
            homeSeriesSection.setVisibility(row.isEmpty() ? View.GONE : View.VISIBLE);
            if (!row.isEmpty()) {
                maybeSetInitialHero(row.get(0));
                ImageLoader.prefetch(this, homeSeries, 8);
            }
        });
        if (enabledCount == 0) finishVisibilityOnlyHomeState();
    }

    private void finishVisibilityOnlyHomeState() {
        tvHomeLoading.setVisibility(View.GONE);
        tvHomeStatus.setText("No hay categorías habilitadas por Administración.");
        tvHomeStatus.setVisibility(View.VISIBLE);
    }

    private interface HomeItemsConsumer {
        void accept(List<Channel> items);
    }

    private void loadHomeSource(CatalogSource source, HomeItemsConsumer consumer) {
        CatalogRepository.load(this, source, new CatalogRepository.Callback() {
            @Override public void onLoaded(List<Channel> items, boolean fromRemote) {
                consumer.accept(items == null ? new ArrayList<>() : items);
                finishHomeLoad(true);
            }

            @Override public void onError(String message) {
                finishHomeLoad(false);
            }
        });
    }

    private void updateHomeLiveRow() {
        List<TvHomeContentAdapter.HomeItem> combined = new ArrayList<>();
        int max = Math.max(homeTv1.size(), homeTv2.size());
        for (int i = 0; i < max && combined.size() < 18; i++) {
            if (i < homeTv1.size()) combined.add(
                    new TvHomeContentAdapter.HomeItem(CatalogSource.TV1, homeTv1.get(i)));
            if (combined.size() >= 18) break;
            if (i < homeTv2.size()) combined.add(
                    new TvHomeContentAdapter.HomeItem(CatalogSource.TV2, homeTv2.get(i)));
        }
        homeLiveAdapter.submitList(combined);
        homeLiveSection.setVisibility(combined.isEmpty() ? View.GONE : View.VISIBLE);
        if (!combined.isEmpty()) maybeSetInitialHero(combined.get(0));
    }

    private void finishHomeLoad(boolean success) {
        if (success) homeLoadSuccessCount++;
        else homeLoadErrorCount++;

        homeLoadsRemaining = Math.max(0, homeLoadsRemaining - 1);
        if (homeLoadsRemaining > 0) return;
        tvHomeLoading.setVisibility(View.GONE);
        boolean anything = !homeTv1.isEmpty() || !homeTv2.isEmpty()
                || !homeMovies.isEmpty() || !homeSeries.isEmpty();
        if (!anything) {
            tvHomeStatus.setText("No se pudo cargar el contenido. Abrí una sección para reintentar.");
            tvHomeStatus.setVisibility(View.VISIBLE);
        }
        if (contentRefreshInProgress) {
            contentRefreshInProgress = false;
            String message = homeLoadErrorCount == 0 && homeLoadSuccessCount > 0
                    ? "Contenido actualizado"
                    : homeLoadSuccessCount > 0
                    ? "Contenido actualizado parcialmente"
                    : "No se pudo actualizar el contenido";
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Fuerza una recarga real de TV1, TV2, Películas y Series sin cerrar la app.
     * Borra únicamente cachés de catálogo; conserva sesión, usuario y dispositivo vinculado.
     */
    private void refreshTvContent() {
        if (homeLoadsRemaining > 0 || contentRefreshInProgress) {
            Toast.makeText(this, "El contenido ya se está cargando", Toast.LENGTH_SHORT).show();
            return;
        }

        contentRefreshInProgress = true;
        Toast.makeText(this, "Actualizando contenido…", Toast.LENGTH_SHORT).show();

        CatalogRepository.clearTransientCache();
        CatalogRepository.clearSeriesCache(this);

        // Evita que el destacado conserve una referencia a un elemento ya reemplazado.
        selectedHomeItem = null;
        heroUserSelected = false;
        heroInitialPriority = 0;

        refreshContinueHome();
        refreshGlobalSourceVisibility(false);
        contentRefreshInProgress = false;
    }

    private void maybeSetInitialHero(TvHomeContentAdapter.HomeItem item) {
        if (item == null || heroUserSelected || managedBannerActive) return;
        int priority = item.source == CatalogSource.SERIES ? 3
                : item.source == CatalogSource.MOVIES ? 2 : 1;
        if (selectedHomeItem == null || priority > heroInitialPriority) {
            heroInitialPriority = priority;
            applyHero(item);
        }
    }

    private void applyHero(TvHomeContentAdapter.HomeItem item) {
        if (item == null || item.channel == null) return;
        // Un banner administrado es persistente: el foco de las filas inferiores
        // nunca puede sustituirlo. Sólo el panel puede cambiarlo/desactivarlo.
        if (managedBannerActive) return;
        stopManagedBannerVideo();
        selectedHomeItem = item;
        Channel channel = item.channel;

        String eyebrow;
        String description = channel.description;
        String meta;
        String image = channel.logo;

        if (item.source == CatalogSource.SERIES) {
            eyebrow = "SERIE";
            SeriesStore.SeriesInfo info = SeriesStore.getSeries(channel.id);
            if (info != null) {
                if (!info.backdrop.isEmpty()) image = info.backdrop;
                else if (!info.poster.isEmpty()) image = info.poster;
                if (!info.synopsis.isEmpty()) description = info.synopsis;
                StringBuilder builder = new StringBuilder();
                if (!info.year.isEmpty()) builder.append(info.year);
                if (!info.genre.isEmpty()) {
                    if (builder.length() > 0) builder.append(" · ");
                    builder.append(info.genre);
                }
                if (builder.length() > 0) builder.append(" · ");
                builder.append(info.seasons.size()).append(info.seasons.size() == 1 ? " temporada" : " temporadas");
                builder.append(" · ").append(info.episodeCount()).append(info.episodeCount() == 1 ? " episodio" : " episodios");
                meta = builder.toString();
            } else {
                meta = safeCategory(channel.category);
            }
        } else if (item.source == CatalogSource.MOVIES) {
            eyebrow = "PELÍCULA";
            meta = safeCategory(channel.category);
        } else {
            eyebrow = "EN VIVO · " + (item.source == CatalogSource.TV2 ? "TV 2" : "TV 1");
            meta = safeCategory(channel.category) + " · Canal en vivo";
        }

        if (description == null || description.trim().isEmpty()) {
            description = item.source == CatalogSource.MOVIES
                    ? "Elegí reproducir para comenzar la película."
                    : item.source == CatalogSource.SERIES
                    ? "Abrí la serie para elegir temporada y episodio."
                    : "Canal disponible en vivo.";
        }

        heroEyebrow.setVisibility(View.VISIBLE);
        heroTitle.setVisibility(View.VISIBLE);
        heroDescription.setVisibility(View.VISIBLE);
        heroMeta.setVisibility(View.VISIBLE);
        heroPlayButton.setVisibility(View.VISIBLE);
        heroExploreButton.setVisibility(View.VISIBLE);
        if (heroScrim != null) heroScrim.setVisibility(View.VISIBLE);

        heroEyebrow.setText(eyebrow);
        heroTitle.setText(channel.name);
        heroDescription.setText(description);
        heroMeta.setText(meta);
        heroPlayButton.setText(item.source == CatalogSource.SERIES ? "Ver serie" : "Reproducir");
        heroExploreButton.setText("Explorar");

        if (image == null || image.trim().isEmpty()) {
            heroImage.setImageResource(R.drawable.cochi_tv_banner);
        } else {
            ImageLoader.load(image, heroImage);
        }
    }

    private void applyManagedHomeBanner(JSONObject banner) {
        bannerRotationHandler.removeCallbacks(bannerRotationRunnable);
        managedBannerMedia.clear();
        managedBannerMediaIndex = 0;
        managedBannerConfig = banner;
        if (!tvHomeMode || banner == null || !banner.optBoolean("enabled", false)) {
            managedBannerActive = false;
            stopManagedBannerVideo();
            return;
        }
        String mediaUrl = banner.optString("mediaUrl", "").trim();
        if (mediaUrl.isEmpty()) return;
        managedBannerMedia.add(mediaUrl);
        JSONArray extras = banner.optJSONArray("extraMediaUrls");
        if (extras != null) {
            for (int i = 0; i < extras.length() && managedBannerMedia.size() < 10; i++) {
                String u = extras.optString(i, "").trim();
                if (!u.isEmpty()) managedBannerMedia.add(u);
            }
        }
        int seconds = Math.max(3, Math.min(60, banner.optInt("rotationSeconds", 8)));
        managedBannerRotationMs = seconds * 1000;
        managedBannerActive = true;
        heroUserSelected = false;
        selectedHomeItem = null;
        managedBannerTargetSource = banner.optString("targetSource", "").trim().toLowerCase();
        managedBannerTargetId = banner.optString("targetId", "").trim();

        heroEyebrow.setText(banner.optString("eyebrow", "DESTACADO"));
        String title = banner.optString("title", "").trim();
        heroTitle.setText(title.isEmpty() ? "CO-CHI" : title);
        heroDescription.setText(banner.optString("description", ""));
        heroMeta.setText(banner.optString("meta", ""));
        String button = banner.optString("buttonText", "Ver ahora").trim();
        String exploreButton = banner.optString("exploreButtonText", "Explorar").trim();
        heroPlayButton.setText(button.isEmpty() ? "Ver ahora" : button);
        heroExploreButton.setText(exploreButton.isEmpty() ? "Explorar" : exploreButton);
        heroEyebrow.setVisibility(banner.optBoolean("showEyebrow", true) ? View.VISIBLE : View.GONE);
        heroTitle.setVisibility(banner.optBoolean("showTitle", true) ? View.VISIBLE : View.GONE);
        heroDescription.setVisibility(banner.optBoolean("showDescription", true) ? View.VISIBLE : View.GONE);
        heroMeta.setVisibility(banner.optBoolean("showMeta", true) ? View.VISIBLE : View.GONE);
        heroPlayButton.setVisibility(banner.optBoolean("showPrimaryButton", true) ? View.VISIBLE : View.GONE);
        heroExploreButton.setVisibility(banner.optBoolean("showExploreButton", true) ? View.VISIBLE : View.GONE);
        if (heroScrim != null) heroScrim.setVisibility(banner.optBoolean("showScrim", true) ? View.VISIBLE : View.GONE);
        applyManagedBannerMedia();
        if (managedBannerMedia.size() > 1) bannerRotationHandler.postDelayed(bannerRotationRunnable, managedBannerRotationMs);
    }

    private void applyManagedBannerMedia() {
        if (managedBannerConfig == null || managedBannerMedia.isEmpty()) return;
        String mediaUrl = managedBannerMedia.get(Math.max(0, Math.min(managedBannerMediaIndex, managedBannerMedia.size() - 1)));
        String fallback = managedBannerConfig.optString("fallbackImage", "").trim();
        // El primer elemento conserva el tipo configurado; las posiciones 2-10 son portadas fijas.
        boolean first = managedBannerMediaIndex == 0;
        String type = first ? managedBannerConfig.optString("type", "image").toLowerCase() : "image";
        if ("video".equals(type)) {
            if (!fallback.isEmpty()) ImageLoader.load(fallback, heroImage);
            else heroImage.setImageResource(R.drawable.cochi_tv_banner);
            startManagedBannerVideo(mediaUrl);
        } else {
            stopManagedBannerVideo();
            if (heroVideo != null) heroVideo.setVisibility(View.GONE);
            if (heroYoutube != null) heroYoutube.setVisibility(View.GONE);
            ImageLoader.load(mediaUrl, heroImage);
        }
    }

    private void startManagedBannerVideo(String url) {
        stopManagedBannerVideo();
        if (url == null || url.trim().isEmpty()) return;
        if (PlayerRouter.isYoutube(url)) {
            startManagedBannerYoutube(url);
            return;
        }
        if (heroVideo == null) return;
        try {
            heroVideoPlayer = new ExoPlayer.Builder(this).build();
            heroVideo.setPlayer(heroVideoPlayer);
            heroVideo.setUseController(false);
            heroVideo.setVisibility(View.VISIBLE);
            heroVideoPlayer.setVolume(0f);
            heroVideoPlayer.setRepeatMode(Player.REPEAT_MODE_ONE);
            heroVideoPlayer.addListener(new Player.Listener() {
                @Override public void onPlayerError(PlaybackException error) {
                    runOnUiThread(() -> stopManagedBannerVideo());
                }
            });
            heroVideoPlayer.setMediaItem(MediaItem.fromUri(url.trim()));
            heroVideoPlayer.prepare();
            heroVideoPlayer.play();
        } catch (Exception ignored) {
            stopManagedBannerVideo();
        }
    }

    private void startManagedBannerYoutube(String url) {
        if (heroYoutube == null) return;
        String videoId = PlayerRouter.youtubeVideoId(url);
        if (videoId == null || videoId.trim().isEmpty()) return;
        try {
            WebSettings settings = heroYoutube.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setMediaPlaybackRequiresUserGesture(false);
            heroYoutube.setWebChromeClient(new WebChromeClient());
            heroYoutube.setWebViewClient(new WebViewClient());
            heroYoutube.setVisibility(View.VISIBLE);
            String safeId = videoId.replaceAll("[^A-Za-z0-9_-]", "");
            String html = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'>" +
                    "<script src='https://www.youtube.com/iframe_api'></script></head>" +
                    "<body style='margin:0;background:#000;overflow:hidden;position:relative'><div id='player' style='position:absolute;width:120%;height:120%;left:-10%;top:-10%'></div>" +
                    "<script>var p;function onYouTubeIframeAPIReady(){p=new YT.Player('player',{width:'100%',height:'100%',videoId:'" + safeId + "'," +
                    "playerVars:{autoplay:1,controls:0,loop:1,playlist:'" + safeId + "',playsinline:1,rel:0,modestbranding:1}," +
                    "events:{onReady:function(e){try{e.target.setPlaybackQuality('hd1080');e.target.unMute();e.target.setVolume(100);e.target.playVideo();}catch(x){}}," +
                    "onStateChange:function(e){if(e.data===YT.PlayerState.ENDED){try{e.target.seekTo(0);e.target.playVideo();}catch(x){}}}}});}" +
                    "</script></body></html>";
            heroYoutube.loadDataWithBaseURL("https://www.youtube-nocookie.com", html, "text/html", "UTF-8", null);
        } catch (Exception ignored) {
            try { heroYoutube.setVisibility(View.GONE); } catch (Exception ignored2) {}
        }
    }

    private void stopManagedBannerVideo() {
        if (heroVideoPlayer != null) {
            try { heroVideoPlayer.release(); } catch (Exception ignored) {}
            heroVideoPlayer = null;
        }
        if (heroVideo != null) {
            heroVideo.setPlayer(null);
            heroVideo.setVisibility(View.GONE);
        }
        if (heroYoutube != null) {
            try {
                heroYoutube.stopLoading();
                heroYoutube.loadUrl("about:blank");
                heroYoutube.clearHistory();
                heroYoutube.setVisibility(View.GONE);
            } catch (Exception ignored) {}
        }
    }

    private CatalogSource managedBannerSource() {
        switch (managedBannerTargetSource) {
            case "tv1": return CatalogSource.TV1;
            case "tv2": return CatalogSource.TV2;
            case "movies": return CatalogSource.MOVIES;
            case "series": return CatalogSource.SERIES;
            default: return null;
        }
    }

    private void openManagedBannerSection() {
        CatalogSource source = managedBannerSource();
        if (source == null) return;
        if (source == CatalogSource.TV1 || source == CatalogSource.TV2) openTv(source, false);
        else openCatalog(source);
    }

    private void openManagedBannerTarget() {
        CatalogSource source = managedBannerSource();
        if (source == null) return;
        if (!managedBannerTargetId.isEmpty()) {
            List<Channel> list = sourceItems(source);
            for (Channel channel : list) {
                if (channel != null && managedBannerTargetId.equalsIgnoreCase(channel.id)) {
                    openHomeItem(new TvHomeContentAdapter.HomeItem(source, channel));
                    return;
                }
            }
        }
        openManagedBannerSection();
    }

    private void openHomeItem(TvHomeContentAdapter.HomeItem item) {
        if (item == null || item.channel == null) return;
        if (item.source == CatalogSource.SERIES) {
            SeriesStore.SeriesInfo series = SeriesStore.getSeries(item.channel.id);
            if (series == null || series.episodeCount() == 0) {
                openCatalog(CatalogSource.SERIES);
                return;
            }
            Intent intent = new Intent(this, SeriesDetailActivity.class);
            intent.putExtra(SeriesDetailActivity.EXTRA_SERIES_ID, item.channel.id);
            startActivity(intent);
            return;
        }

        List<Channel> sourceItems = sourceItems(item.source);
        int index = indexOf(sourceItems, item.channel.id);
        if (index < 0) {
            exploreSource(item.source);
            return;
        }

        ChannelStore.setActiveChannels(sourceItems);
        Intent intent = new Intent(this, PlayerActivity.class);
        intent.putExtra(PlayerActivity.EXTRA_STORE_ITEM, true);
        intent.putExtra(PlayerActivity.EXTRA_CHANNEL_INDEX, index);
        intent.putExtra(PlayerActivity.EXTRA_CATALOG_SOURCE, item.source.name());
        startActivity(intent);
    }

    private void exploreSource(CatalogSource source) {
        if (source == CatalogSource.TV1 || source == CatalogSource.TV2) {
            openTv(source, false);
        } else {
            openCatalog(source == CatalogSource.SERIES ? CatalogSource.SERIES : CatalogSource.MOVIES);
        }
    }

    private List<Channel> sourceItems(CatalogSource source) {
        if (source == CatalogSource.TV2) return homeTv2;
        if (source == CatalogSource.MOVIES) return homeMovies;
        if (source == CatalogSource.SERIES) return homeSeries;
        return homeTv1;
    }

    private int indexOf(List<Channel> items, String id) {
        if (items == null || id == null) return -1;
        for (int i = 0; i < items.size(); i++) {
            Channel channel = items.get(i);
            if (channel != null && id.equals(channel.id)) return i;
        }
        return -1;
    }

    private List<Channel> filterNonAdult(List<Channel> items) {
        List<Channel> visible = new ArrayList<>();
        if (items != null) {
            for (Channel item : items) {
                if (item != null && !item.adult) visible.add(item);
            }
        }
        return visible;
    }

    private List<TvHomeContentAdapter.HomeItem> wrap(
            CatalogSource source, List<Channel> items, int limit) {
        List<TvHomeContentAdapter.HomeItem> out = new ArrayList<>();
        if (items == null) return out;
        int count = Math.min(limit, items.size());
        for (int i = 0; i < count; i++) {
            out.add(new TvHomeContentAdapter.HomeItem(source, items.get(i)));
        }
        return out;
    }

    private void refreshContinueHome() {
        if (!tvHomeMode || homeContinueAdapter == null || homeContinueSection == null) return;
        List<ProgressManager.Entry> entries = ProgressManager.getAll(this);
        homeContinueAdapter.submitList(entries);
        homeContinueSection.setVisibility(entries.isEmpty() ? View.GONE : View.VISIBLE);
    }

    private void setupTvNavButton(int id, boolean selected, View.OnClickListener listener) {
        View view = findViewById(id);
        if (!(view instanceof MaterialButton)) return;
        MaterialButton button = (MaterialButton) view;
        button.setOnClickListener(listener);
        button.setOnFocusChangeListener((v, hasFocus) -> {
            button.animate().cancel();
            button.setScaleX(1f);
            button.setScaleY(1f);
            boolean locked = Boolean.FALSE.equals(button.getTag());
            if (locked) {
                button.setBackgroundTintList(ContextCompat.getColorStateList(this,
                        hasFocus ? R.color.cochi_locked_surface_focus : R.color.cochi_locked_surface));
                button.setStrokeColor(ContextCompat.getColorStateList(this, R.color.cochi_locked_border));
                button.setStrokeWidth(dp(hasFocus ? 2 : 1));
                return;
            }
            boolean strong = hasFocus || selected;
            button.setBackgroundTintList(ColorStateList.valueOf(strong ? ManagedTheme.selection(this) : ManagedTheme.button(this)));
            button.setStrokeColor(ColorStateList.valueOf(strong ? ManagedTheme.primary(this) : ManagedTheme.border(this)));
            button.setTextColor(ManagedTheme.text(this));
            button.setIconTint(ColorStateList.valueOf(ManagedTheme.primary(this)));
            button.setStrokeWidth(dp(strong ? 2 : 1));
        });
    }

    private void setupHeroButton(MaterialButton button) {
        if (button == null) return;
        button.setOnFocusChangeListener((v, hasFocus) -> {
            button.animate().scaleX(hasFocus ? 1.045f : 1f).scaleY(hasFocus ? 1.045f : 1f)
                    .setDuration(120).start();
            button.setStrokeColor(ColorStateList.valueOf(hasFocus ? ManagedTheme.primary(this) : ManagedTheme.border(this)));
            button.setStrokeWidth(dp(hasFocus ? 3 : 1));
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        sectionLaunchInProgress = false;
        if (!SessionManager.isActivated(this)) return;
        if (SessionManager.isExpired(this)) {
            openExpired();
            return;
        }
        refreshAccountStatus();
        refreshGlobalSourceVisibility(false);
        if (tvHomeMode) {
            refreshContinueHome();
            return;
        }
        if (cardContinue == null) return;
        int count = ProgressManager.count(this);
        cardContinue.setVisibility(count > 0 ? View.VISIBLE : View.GONE);
        continueLabel.setText(count == 1 ? "SEGUIR VIENDO · 1" : "SEGUIR VIENDO · " + count);
    }

    private void refreshGlobalSourceVisibility(boolean loadTvAfter) {
        new Thread(() -> {
            try {
                JSONObject config = BackendClient.clientConfig(this);
                SourceVisibility.applyConfig(config);
                ManagedTheme.update(this, config.optJSONObject("appTheme"));
                SessionManager.updateDeviceCapacity(this, config);
                runOnUiThread(() -> {
                    if (tvHomeMode) { applyManagedTheme(); applyManagedHomeBanner(config.optJSONObject("homeBanner")); }
                    refreshAccountStatus();
                    applyGlobalSourceVisibility();
                    if (tvHomeMode && (loadTvAfter || homeLoadsRemaining == 0)) {
                        selectedHomeItem = null;
                        heroUserSelected = false;
                        heroInitialPriority = 0;
                        loadTvHomeData();
                    }
                });
            } catch (Exception ignored) {
                runOnUiThread(() -> {
                    applyGlobalSourceVisibility();
                    if (tvHomeMode && loadTvAfter) loadTvHomeData();
                });
            }
        }, "cochi-source-visibility").start();
    }

    private void applyGlobalSourceVisibility() {
        // v0.23.63: las categorías ya no desaparecen. Mantener su lugar evita saltos
        // en celular; cuando PANEL las desactiva quedan visibles con candado y sin acceso.
        applyCategoryCardState(R.id.cardTv1, SourceVisibility.isVisible(CatalogSource.TV1), R.drawable.ic_cochi_monitor);
        applyCategoryCardState(R.id.cardTv2, SourceVisibility.isVisible(CatalogSource.TV2), R.drawable.ic_cochi_monitor);
        applyCategoryCardState(R.id.cardMovies, SourceVisibility.isVisible(CatalogSource.MOVIES), R.drawable.ic_cochi_movies);
        applyCategoryCardState(R.id.cardSeries, SourceVisibility.isVisible(CatalogSource.SERIES), R.drawable.ic_cochi_series);
        applyCategoryCardState(R.id.cardAdult, SourceVisibility.isAdultVisible(), R.drawable.ic_cochi_lock);

        applyTvNavState(R.id.tvNavTv1, SourceVisibility.isVisible(CatalogSource.TV1), R.drawable.ic_cochi_tv, "TV 1");
        applyTvNavState(R.id.tvNavTv2, SourceVisibility.isVisible(CatalogSource.TV2), R.drawable.ic_cochi_monitor, "TV 2");
        applyTvNavState(R.id.tvNavMovies, SourceVisibility.isVisible(CatalogSource.MOVIES), R.drawable.ic_cochi_movies, "Películas");
        applyTvNavState(R.id.tvNavSeries, SourceVisibility.isVisible(CatalogSource.SERIES), R.drawable.ic_cochi_series, "Series");
        applyTvNavState(R.id.tvNavAdult, SourceVisibility.isAdultVisible(), R.drawable.ic_cochi_lock, "Adultos");

        // El contenido premium de TV no debe mostrar filas de una fuente bloqueada.
        // v0.23.69: Inicio queda limpio: banner + Continuar viendo.
        // TV1/TV2/Películas/Series se abren exclusivamente desde el menú lateral.
        if (homeMoviesSection != null) homeMoviesSection.setVisibility(View.GONE);
        if (homeSeriesSection != null) homeSeriesSection.setVisibility(View.GONE);
        if (homeLiveSection != null) homeLiveSection.setVisibility(View.GONE);
    }

    private void applyCategoryCardState(int id, boolean enabled, int normalIconRes) {
        View view = findViewById(id);
        if (view == null) return;
        view.setVisibility(View.VISIBLE);
        view.setAlpha(enabled ? 1f : 0.58f);
        if (view instanceof MaterialCardView) {
            MaterialCardView card = (MaterialCardView) view;
            if (card.getChildCount() > 0 && card.getChildAt(0) instanceof LinearLayout) {
                LinearLayout content = (LinearLayout) card.getChildAt(0);
                for (int i = 0; i < content.getChildCount(); i++) {
                    if (content.getChildAt(i) instanceof ImageView) {
                        ((ImageView) content.getChildAt(i)).setImageResource(
                                enabled ? normalIconRes : R.drawable.ic_cochi_lock);
                        break;
                    }
                }
            }
        }
    }

    private void applyTvNavState(int id, boolean enabled, int normalIconRes, String normalText) {
        View view = findViewById(id);
        if (!(view instanceof MaterialButton)) return;
        MaterialButton button = (MaterialButton) view;
        button.setVisibility(View.VISIBLE);
        button.setTag(enabled);
        button.setAlpha(enabled ? 1f : 0.92f);
        button.setIconResource(enabled ? normalIconRes : R.drawable.ic_cochi_lock);
        button.setText(normalText);
        button.setBackgroundTintList(ColorStateList.valueOf(enabled ? ManagedTheme.button(this) : ContextCompat.getColor(this,R.color.cochi_locked_surface)));
        button.setStrokeColor(ColorStateList.valueOf(enabled ? ManagedTheme.border(this) : ContextCompat.getColor(this,R.color.cochi_locked_border)));
        button.setTextColor(ManagedTheme.text(this));
        if(enabled) button.setIconTint(ColorStateList.valueOf(ManagedTheme.primary(this)));
    }

    private void openSourceIfEnabled(CatalogSource source, Runnable action) {
        if (!SourceVisibility.isVisible(source)) {
            showCategoryUnavailable();
            return;
        }
        if (action != null) action.run();
    }

    private void openAdultIfEnabled() {
        if (!SourceVisibility.isAdultVisible()) {
            showCategoryUnavailable();
            return;
        }
        requestAdultPin();
    }

    private void showCategoryUnavailable() {
        Toast.makeText(this, "Contenido bloqueado", Toast.LENGTH_SHORT).show();
    }

    private void refreshAccountStatus() {
        if (accountStatus == null || accountStatusTitle == null) return;
        int days = SessionManager.daysRemaining(this);
        if (tvHomeMode && expirationDaysBadge != null) {
            // TV: indicador compacto junto a CO-CHI. Se actualiza con los días reales de la sesión.
            expirationDaysBadge.setText(String.valueOf(Math.max(0, days)));
            expirationDaysBadge.setContentDescription(Math.max(0, days) + " días restantes");
        }
        if (SessionManager.isExpired(this)) {
            accountStatusTitle.setText("CUENTA EXPIRADA");
            accountStatus.setText("Renová para continuar");
            return;
        }

        String slot = SessionManager.devicePositionLabel(this);
        String slotSuffix = slot.isEmpty() ? "" : " · dispositivo " + slot;
        if (SessionManager.isShortAccess(this)) {
            accountStatusTitle.setText("DEMO ACTIVO");
            accountStatus.setText(SessionManager.minutesRemaining(this) + " min restantes" + slotSuffix);
        } else {
            long remaining = SessionManager.millisRemaining(this);
            accountStatusTitle.setText(remaining <= 2L * 24L * 60L * 60L * 1000L ? "ATENCIÓN" : "CUENTA ACTIVA");
            accountStatus.setText("vence en " + SessionManager.remainingTimeText(this) + slotSuffix);
        }

        accountStatusTitle.setTextColor(ManagedTheme.primary(this));
        accountStatus.setTextColor(ContextCompat.getColor(this, R.color.cochi_text));
    }

    private void showUnlinkConfirmation() {
        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle("Desvincular dispositivo")
                .setMessage("¿Estás seguro de que deseas desvincular este dispositivo?")
                .setNegativeButton("Cancelar", null)
                .setPositiveButton("Sí, desvincular", (d, which) -> {
                    SessionManager.logout(this);
                    openLogin();
                })
                .create();
        dialog.setOnShowListener(d -> {
            // Opción segura por defecto, especialmente para control remoto/TV Box.
            android.widget.Button cancel = dialog.getButton(AlertDialog.BUTTON_NEGATIVE);
            if (cancel != null) cancel.requestFocus();
        });
        dialog.show();
    }

    private void setupCard(int id, View.OnClickListener listener) {
        View card = findViewById(id);
        if (card == null) return;
        card.setOnClickListener(listener);
        card.setOnFocusChangeListener((v, hasFocus) -> {
            v.animate()
                    .scaleX(hasFocus ? 1.045f : 1f)
                    .scaleY(hasFocus ? 1.045f : 1f)
                    .setDuration(120).start();
            if (v instanceof MaterialCardView) {
                MaterialCardView materialCard = (MaterialCardView) v;
                materialCard.setStrokeColor(ContextCompat.getColor(this,
                        hasFocus ? R.color.cochi_accent_2 : R.color.cochi_border));
                materialCard.setStrokeWidth(dp(hasFocus ? 4 : 2));
                materialCard.setCardBackgroundColor(ContextCompat.getColor(this,
                        hasFocus ? R.color.cochi_surface_focus : R.color.cochi_surface));
                materialCard.setCardElevation(dp(hasFocus ? 12 : 3));
            }
        });
    }

    private boolean isTelevision() {
        UiModeManager uiModeManager = (UiModeManager) getSystemService(Context.UI_MODE_SERVICE);
        return (uiModeManager != null
                && uiModeManager.getCurrentModeType() == Configuration.UI_MODE_TYPE_TELEVISION)
                || getPackageManager().hasSystemFeature("android.software.leanback");
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private String safeCategory(String value) {
        if (value == null || value.trim().isEmpty()) return "General";
        return value.trim();
    }

    private void openTv(CatalogSource source, boolean adultOnly) {
        if (sectionLaunchInProgress) return;
        sectionLaunchInProgress = true;
        Intent intent = new Intent(this, TvActivity.class);
        intent.putExtra(TvActivity.EXTRA_ADULT_ONLY, adultOnly);
        intent.putExtra(TvActivity.EXTRA_SOURCE, source.name());
        startActivity(intent);
    }

    private void openWebSearch() {
        if (sectionLaunchInProgress) return;
        sectionLaunchInProgress = true;
        startActivity(new Intent(this, WebSearchActivity.class));
    }

    private void openCatalog(CatalogSource source) {
        if (sectionLaunchInProgress) return;
        sectionLaunchInProgress = true;
        Intent intent = new Intent(this, CatalogActivity.class);
        intent.putExtra(CatalogActivity.EXTRA_SOURCE, source.name());
        startActivity(intent);
    }

    private void requestAdultPin() {
        EditText pinInput = new EditText(this);
        pinInput.setHint("PIN de 4 dígitos");
        pinInput.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_VARIATION_PASSWORD);
        pinInput.setMaxLines(1);
        int pad = Math.round(20 * getResources().getDisplayMetrics().density);
        pinInput.setPadding(pad, pad / 2, pad, pad / 2);

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle("Acceso restringido")
                .setMessage("Ingresá el PIN para acceder a esta sección.")
                .setView(pinInput)
                .setNegativeButton("Cancelar", null)
                .setPositiveButton("Ingresar", null)
                .create();

        dialog.setOnShowListener(ignored -> dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                .setOnClickListener(v -> {
                    String pin = pinInput.getText().toString().trim();
                    if (pin.isEmpty()) {
                        pinInput.setError("Ingresá el PIN");
                        return;
                    }
                    dialog.getButton(AlertDialog.BUTTON_POSITIVE).setEnabled(false);
                    new Thread(() -> {
                        try {
                            org.json.JSONObject response = BackendClient.verifyAdultPin(MainActivity.this, pin);
                            runOnUiThread(() -> {
                                dialog.getButton(AlertDialog.BUTTON_POSITIVE).setEnabled(true);
                                if (response.optBoolean("allowed", false)) {
                                    dialog.dismiss();
                                    openTv(CatalogSource.TV1, true);
                                } else {
                                    pinInput.setError("PIN incorrecto");
                                }
                            });
                        } catch (Exception e) {
                            runOnUiThread(() -> {
                                dialog.getButton(AlertDialog.BUTTON_POSITIVE).setEnabled(true);
                                pinInput.setError(e.getMessage() == null ? "No se pudo verificar" : e.getMessage());
                            });
                        }
                    }, "cochi-adult-pin").start();
                }));
        dialog.show();
    }

    @Override
    protected void onDestroy() {
        stopManagedBannerVideo();
        super.onDestroy();
    }

    private void openExpired() {
        Intent intent = new Intent(this, ExpiredActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    private void openLogin() {
        Intent intent = new Intent(this, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}
