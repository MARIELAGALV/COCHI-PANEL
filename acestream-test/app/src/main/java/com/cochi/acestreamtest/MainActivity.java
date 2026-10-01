package com.cochi.acestreamtest;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final String TEST_ID = "f16d68fa5ff64f3894a45062ca28e4e66f142c6a";
    private EditText input;
    private TextView status;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setPadding(dp(22), dp(34), dp(22), dp(24));
        root.setBackgroundColor(Color.rgb(4, 11, 24));

        TextView title = new TextView(this);
        title.setText("CO-CHI\nACE STREAM TEST");
        title.setTextColor(Color.rgb(0, 225, 255));
        title.setTextSize(28);
        title.setGravity(Gravity.CENTER);
        title.setTypeface(null, 1);
        root.addView(title, lp(-1, -2, 0, 0, 0, 18));

        TextView info = new TextView(this);
        info.setText("Prueba separada de CO-CHI. No cambia el reproductor. Solo comprueba si el dispositivo puede abrir enlaces acestream:// con el motor Ace Stream instalado.");
        info.setTextColor(Color.WHITE);
        info.setTextSize(15);
        info.setGravity(Gravity.CENTER);
        root.addView(info, lp(-1, -2, 0, 0, 0, 18));

        input = new EditText(this);
        input.setSingleLine(false);
        input.setText("acestream://" + TEST_ID);
        input.setTextColor(Color.WHITE);
        input.setHintTextColor(Color.GRAY);
        input.setHint("acestream://CONTENT_ID");
        input.setBackgroundColor(Color.rgb(13, 28, 50));
        input.setPadding(dp(12), dp(12), dp(12), dp(12));
        root.addView(input, lp(-1, -2, 0, 0, 0, 14));

        Button test = new Button(this);
        test.setText("ABRIR ACE STREAM");
        test.setTextSize(16);
        test.setAllCaps(false);
        test.setOnClickListener(v -> openAceStream());
        root.addView(test, lp(-1, dp(56), 0, 0, 0, 14));

        Button reset = new Button(this);
        reset.setText("CARGAR DAZN F1 DE PRUEBA");
        reset.setTextSize(14);
        reset.setAllCaps(false);
        reset.setOnClickListener(v -> {
            input.setText("acestream://" + TEST_ID);
            status.setText("ID de prueba cargado. Tocá ABRIR ACE STREAM.");
        });
        root.addView(reset, lp(-1, dp(52), 0, 0, 0, 18));

        status = new TextView(this);
        status.setText("Esperando prueba.");
        status.setTextColor(Color.rgb(180, 220, 235));
        status.setTextSize(14);
        status.setGravity(Gravity.CENTER);
        root.addView(status, lp(-1, -2, 0, 0, 0, 0));

        setContentView(root);
    }

    private void openAceStream() {
        String value = input.getText() == null ? "" : input.getText().toString().trim();
        if (value.isEmpty()) {
            status.setText("Pegá un Content ID o una URL acestream://.");
            return;
        }
        if (!value.startsWith("acestream://")) {
            value = "acestream://" + value;
        }

        Uri uri;
        try {
            uri = Uri.parse(value);
        } catch (Exception e) {
            status.setText("URL AceStream inválida.");
            return;
        }

        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        if (intent.resolveActivity(getPackageManager()) == null) {
            status.setText("No encontré ninguna app instalada que maneje acestream://. Instalá o activá Ace Stream Engine/Media y volvé a probar.");
            Toast.makeText(this, "Ace Stream no está disponible en este dispositivo", Toast.LENGTH_LONG).show();
            return;
        }

        try {
            status.setText("Ace Stream detectado. Abriendo el Content ID…");
            startActivity(intent);
        } catch (ActivityNotFoundException e) {
            status.setText("El sistema no pudo abrir Ace Stream aunque detectó el enlace.");
        } catch (Exception e) {
            status.setText("Error al abrir Ace Stream: " + e.getClass().getSimpleName());
        }
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private LinearLayout.LayoutParams lp(int w, int h, int l, int t, int r, int b) {
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(w, h);
        p.setMargins(dp(l), dp(t), dp(r), dp(b));
        return p;
    }
}
