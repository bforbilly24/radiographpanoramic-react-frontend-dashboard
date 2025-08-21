import {
    ChartColumnBigIcon,
    DatabaseIcon,
    TrendingUpIcon,
    WandSparklesIcon,
    ZapIcon
} from "lucide-react";

const FEATURES = [
    {
        title: "Peningkatan Pengalaman Pengguna",
        description: "Kelola data pasien dan interaksi dengan alat AI canggih secara efisien",
        icon: WandSparklesIcon,
        image: "/images/feature-two.svg",
    },
    {
        title: "Wawasan Mendalam",
        description: "Dapatkan wawasan mendalam tentang kondisi gigi pasien melalui analisis AI",
        icon: ChartColumnBigIcon,
        image: "/images/feature-one.svg",
    },
    {
        title: "Pengelolaan Data",
        description: "Kelola data radiograf dan pasien dengan mudah dan efisien",
        icon: DatabaseIcon,
        image: "/images/feature-three.svg",
    },
    {
        title: "Analisis Cepat",
        description: "Pantau dan analisis hasil radiograf dengan cepat menggunakan AI",
        icon: TrendingUpIcon,
        image: "/images/feature-four.svg",
    },
    {
        title: "Optimasi Cerdas",
        description: "Optimasi berbasis AI untuk diagnosa gigi yang lebih cerdas",
        icon: ZapIcon,
        image: "/images/feature-five.svg",
    }
]

export { FEATURES }