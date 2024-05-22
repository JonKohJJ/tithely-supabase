import { useEffect, useState } from 'react';
import HeroImage_HighQualityProds from '../../assets/images/High Quality Products.png';
import HeroImage_Discovery from '../../assets/images/Discovery.png';
import HeroImage_Discount from '../../assets/images/discount.png';

const images = [
    HeroImage_Discovery,
    HeroImage_HighQualityProds,
    HeroImage_Discount,
];

const HeroImage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [prevImageIndex, setPrevImageIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const scrollHeight = document.body.scrollHeight;

            // Calculate the percentage of scroll progress
            const scrollPercent = (scrollTop / (scrollHeight - windowHeight)) * 100;

            // Determine the image index based on the scroll percentage
            const newIndex = Math.floor((scrollPercent / 100) * images.length);

            // Ensure newIndex is within bounds
            if (newIndex >= 0 && newIndex < images.length) {
                setPrevImageIndex(currentImageIndex);
                setCurrentImageIndex(newIndex);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentImageIndex]);

    return (
        <div className={`home-hero-image hidden w-full laptop:block laptop:w-[40%] sticky top-0 h-[calc(100vh-104px-48px)]`}>
            {images.map((imageUrl, index) => {
                const isActive = index === currentImageIndex;
                const isPrev = index === prevImageIndex;

                return (
                    <img
                        key={index}
                        src={imageUrl}
                        alt={`Hero Image ${index + 1}`}
                        className={`h-full object-contain absolute transition-opacity duration-1000 ease-in-out 
                            ${ isActive ? 'opacity-100' : isPrev ? 'opacity-0' : 'opacity-0' }
                            ${ imageUrl === HeroImage_Discovery ? '-scale-x-150 scale-y-150' : '' }
                        `}
                    />
                );
            })}
        </div>
    );
};

export default HeroImage;
