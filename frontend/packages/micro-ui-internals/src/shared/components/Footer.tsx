const Footer = () => {
    return (
        <footer className="w-full h-[50px] bg-brand-bg-surface text-center p-[10px_0] border-t border-gray-200 shadow-[0_-2px_8px_rgba(123,203,196,0.1)] flex justify-center items-center z-[1000] mt-auto">
            <p className="text-sm text-gray-500 m-0">© {new Date().getFullYear()} prodify, Inc. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
