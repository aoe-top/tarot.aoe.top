// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import GiscusComment from "./components/GiscusComment.vue";
import FriendlyLinks from "./components/FriendlyLinks.vue";

import imageViewer from "vitepress-plugin-image-viewer";
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue";
import { useRoute, useRouter } from "vitepress";
import { normalizePath, needsNormalization } from "./routeNormalizer";

import "./style.css";

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
            "doc-after": () => h(GiscusComment),
            "layout-bottom": () => h(FriendlyLinks),
        });
    },
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp(ctx);
        // Register global components, if you don't want to use it, you don't need to add it
        ctx.app.component("vImageViewer", vImageViewer);

        // Handle case-insensitive routing
        if (typeof window !== "undefined") {
            const router = ctx.router;

            // Intercept route changes and normalize paths
            const originalGo = router.go;
            router.go = function (to?: string) {
                if (to && needsNormalization(to)) {
                    const normalizedPath = normalizePath(to);
                    console.log(`Redirecting from ${to} to ${normalizedPath}`);
                    return originalGo.call(this, normalizedPath);
                }
                return originalGo.call(this, to);
            };

            // Check current path on initial load
            const currentPath = window.location.pathname;
            if (needsNormalization(currentPath)) {
                const normalizedPath = normalizePath(currentPath);
                console.log(
                    `Initial redirect from ${currentPath} to ${normalizedPath}`,
                );
                window.history.replaceState({}, "", normalizedPath);
                router.go(normalizedPath);
            }
        }
    },
    setup() {
        // Get route
        const route = useRoute();
        // Using
        imageViewer(route);
    },
} satisfies Theme;
