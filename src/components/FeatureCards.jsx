import { Monitor, Download, Smartphone, Users } from 'lucide-react';

const FeatureCards = () => {
    const features = [
        {
            title: "Enjoy on your TV",
            desc: "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.",
            icon: <Monitor className="w-12 h-12 text-cinevo-red" />,
            bgColor: "from-[#192247] to-[#210e17]"
        },
        {
            title: "Download your shows to watch offline",
            desc: "Save your favourites easily and always have something to watch.",
            icon: <Download className="w-12 h-12 text-cinevo-red" />,
            bgColor: "from-[#192247] to-[#210e17]"
        },
        {
            title: "Watch everywhere",
            desc: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
            icon: <Smartphone className="w-12 h-12 text-cinevo-red" />,
            bgColor: "from-[#192247] to-[#210e17]"
        },
        {
            title: "Create profiles for kids",
            desc: "Send kids on adventures with their favourite characters in a space made just for them — free with your membership.",
            icon: <Users className="w-12 h-12 text-cinevo-red" />,
            bgColor: "from-[#192247] to-[#210e17]"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className={`relative p-6 rounded-2xl bg-gradient-to-br ${feature.bgColor} min-h-[220px] flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
                >
                    <div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        {feature.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeatureCards;
