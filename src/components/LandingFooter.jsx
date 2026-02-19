import { Globe } from 'lucide-react';

const LandingFooter = () => {
    const links = [
        "FAQ", "Help Centre", "Account", "Media Centre",
        "Investor Relations", "Jobs", "Ways to Watch", "Terms of Use",
        "Privacy", "Cookie Preferences", "Corporate Information", "Contact Us",
        "Speed Test", "Legal Notices", "Only on Cinevo"
    ];

    return (
        <footer className="max-w-6xl mx-auto px-4 md:px-12 py-16 text-gray-400">
            <p className="mb-8">
                Questions? Call <a href="tel:000-800-919-1743" className="hover:underline">000-800-919-1743</a>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
                {links.map((link, index) => (
                    <a key={index} href="#" className="text-sm hover:underline">
                        {link}
                    </a>
                ))}
            </div>

            <div className="relative inline-block mb-10">
                <div className="flex items-center gap-2 border border-gray-600 px-4 py-2 rounded bg-black/50 text-white">
                    <Globe className="w-4 h-4" />
                    <select className="bg-transparent outline-none text-sm cursor-pointer pr-4">
                        <option>English</option>
                        <option>Hindi</option>
                    </select>
                </div>
            </div>

            <p className="text-sm">Cinevo India</p>
        </footer>
    );
};

export default LandingFooter;
