package com.calistenia.app;

import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Configurar edge-to-edge
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        
        // Aplicar insets al contenido raíz para asegurar que se respeten TODAS las barras del sistema
        View contentView = findViewById(android.R.id.content);
        if (contentView != null) {
            ViewCompat.setOnApplyWindowInsetsListener(contentView, (v, windowInsets) -> {
                Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
                
                v.setPadding(
                    insets.left,
                    insets.top,
                    insets.right,
                    insets.bottom // Esto asegura que el contenido suba por encima de la barra de navegación
                );
                
                return WindowInsetsCompat.CONSUMED;
            });
        }
    }
}
