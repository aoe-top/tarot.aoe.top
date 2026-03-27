<script setup lang="ts">
import { onMounted, ref } from "vue";

type FriendlyLink = {
    name: string;
    url: string;
    description?: string;
};

const links = ref<FriendlyLink[]>([]);
const pending = ref(true);
const failed = ref(false);

async function loadLinks() {
    try {
        const response = await fetch("https://api.aoe.top/api/friendly/links");
        if (!response.ok) {
            throw new Error(`Failed to load links: ${response.status}`);
        }
        const data = await response.json();
        links.value = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(error);
        failed.value = true;
    } finally {
        pending.value = false;
    }
}

onMounted(loadLinks);
</script>

<template>
    <section class="friendly-links-shell">
        <div class="friendly-links-card">
            <div class="friendly-links-header">
                <p class="friendly-links-eyebrow">友情链接</p>
                <h2>继续这场温柔的相遇</h2>
                <p>底部实时同步最新友链，让每一次翻页都能延伸到新的灵感站点。</p>
            </div>
            <div v-if="pending" class="friendly-links-state">塔罗牌阵正在为你整理友链...</div>
            <div v-else-if="failed" class="friendly-links-state">友链暂时失联，稍后再回来看看。</div>
            <div v-else class="friendly-links-grid">
                <a
                    v-for="link in links"
                    :key="`${link.name}-${link.url}`"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="friendly-links-item"
                >
                    <span class="friendly-links-name">{{ link.name }}</span>
                    <span v-if="link.description" class="friendly-links-desc">{{ link.description }}</span>
                </a>
            </div>
        </div>
    </section>
</template>

<style scoped>
.friendly-links-shell {
    padding: 0 24px 32px;
}

.friendly-links-card {
    max-width: 1152px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 28px;
    border: 1px solid rgba(194, 146, 87, 0.22);
    background:
        radial-gradient(circle at top left, rgba(226, 178, 92, 0.16), transparent 28%),
        radial-gradient(circle at bottom right, rgba(112, 64, 150, 0.16), transparent 34%),
        linear-gradient(180deg, rgba(24, 17, 35, 0.96), rgba(13, 10, 20, 0.98));
    box-shadow: 0 28px 70px rgba(12, 7, 18, 0.28);
}

.friendly-links-eyebrow {
    margin: 0;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-size: 0.74rem;
    color: #d4b27b;
}

.friendly-links-header h2 {
    margin: 10px 0 12px;
    color: #f7efe2;
    font-size: 1.8rem;
}

.friendly-links-header p {
    margin: 0;
    color: rgba(240, 229, 214, 0.72);
    line-height: 1.8;
}

.friendly-links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 14px;
    margin-top: 24px;
}

.friendly-links-item {
    display: block;
    padding: 15px 16px;
    border-radius: 20px;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.friendly-links-item:hover {
    transform: translateY(-2px);
    border-color: rgba(212, 178, 123, 0.46);
    background: rgba(212, 178, 123, 0.08);
}

.friendly-links-name {
    display: block;
    color: #fff7ec;
    font-weight: 600;
}

.friendly-links-desc {
    display: block;
    margin-top: 6px;
    color: rgba(240, 229, 214, 0.58);
    font-size: 0.86rem;
    line-height: 1.5;
}

.friendly-links-state {
    margin-top: 22px;
    padding: 16px 18px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
    color: rgba(240, 229, 214, 0.72);
}

@media (max-width: 640px) {
    .friendly-links-shell {
        padding: 0 16px 24px;
    }

    .friendly-links-card {
        padding: 22px;
        border-radius: 22px;
    }
}
</style>