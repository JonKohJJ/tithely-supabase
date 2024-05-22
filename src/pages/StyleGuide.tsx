import { useRef, useEffect, useState } from 'react';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import SecondaryButton from '../components/Buttons/SecondaryButton';

const StyleGuide = () => {
  // Refs for each paragraph tag
  const h1Ref = useRef<HTMLParagraphElement>(null);
  const h2Ref = useRef<HTMLParagraphElement>(null);
  const h3Ref = useRef<HTMLParagraphElement>(null);
  const baseRef = useRef<HTMLParagraphElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  
  // State to hold font sizes
  const [fontSizes, setFontSizes] = useState<{ [key: string]: string }>({});

  // Function to update font sizes
  const updateFontSizes = () => {
    const refs = [h1Ref, h2Ref, h3Ref, baseRef, captionRef];
    const newFontSizes: { [key: string]: string } = {};
    refs.forEach((ref, index) => {
      if (ref.current) {
        const computedStyle = window.getComputedStyle(ref.current);
        const fontSize = computedStyle.getPropertyValue('font-size');
        newFontSizes[`fs-${index + 1}`] = fontSize;
      }
    });
    setFontSizes(newFontSizes);
  };

  useEffect(() => {
    // Update font sizes initially
    updateFontSizes();

    // Add event listener for window resize event
    window.addEventListener('resize', updateFontSizes);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', updateFontSizes);
    };
  }, []); // Empty dependency array ensures effect runs only once after mounting

  return (
    <>
        <section className="typography-section flex justify-center">
            <div className="mycontainer">
                <div className='mb-[50px]'>
                    <p className="fs-caption mb-[5px] text-color-text-faded">fs-h1 / {fontSizes['fs-1']}</p>
                    <p className="fs-h1" ref={h1Ref}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque tempora molestiae aperiam incidunt.</p>
                </div>
                <div className='mb-[50px]'>
                    <p className="fs-caption mb-[5px] text-color-text-faded">fs-h2 / {fontSizes['fs-2']}</p>
                    <p className="fs-h2" ref={h2Ref}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis error corporis aliquam iusto doloribus expedita commodi distinctio similique voluptate dolore facilis vitae et debitis omnis quidem cupiditate, minus, quasi enim?</p>
                </div>
                <div className='mb-[50px]'>
                    <p className="fs-caption mb-[5px] text-color-text-faded">fs-h3 / {fontSizes['fs-3']}</p>
                    <p className="fs-h3" ref={h3Ref}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium ea provident cupiditate consequatur? Saepe doloremque, ut molestiae vero magni, sed quod expedita inventore temporibus corporis delectus, fugiat officia rem quo!</p>
                </div>
                <div className='mb-[50px]'>
                    <p className="fs-caption mb-[5px] text-color-text-faded">fs-base / {fontSizes['fs-4']}</p>
                    <p className="fs-base" ref={baseRef}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, quisquam dolores est, beatae cumque vero reprehenderit culpa qui harum alias nisi dicta, recusandae aut magni labore obcaecati eligendi quia facilis quibusdam perspiciatis! Iste tempore sit repellendus itaque est? Unde fuga, velit reiciendis obcaecati est eum aperiam! Ipsum, vero! Iste, corrupti? Numquam adipisci minus quia voluptates impedit hic unde, aperiam consectetur iure vero accusantium enim, amet ut quidem totam quo deserunt atque illum reprehenderit debitis! Quasi quod a voluptates debitis quaerat facere ad.</p>
                </div>
                <div className='mb-[50px]'>
                    <p className="fs-caption mb-[5px] text-color-text-faded">fs-caption / {fontSizes['fs-5']}</p>
                    <p className="fs-caption" ref={captionRef}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto vitae commodi natus laudantium consequuntur numquam. Illo aut neque, adipisci nesciunt, optio, itaque vel odit ab modi tempore voluptatum nostrum! Recusandae!
                    Suscipit beatae voluptates soluta autem error hic atque vero? Aliquid ea velit similique quasi dolorum ut beatae, consectetur enim officiis minima pariatur! Possimus, dolore nisi quam neque harum placeat rem.</p>
                </div>

                <div className='mb-[50px]'>
                    <p className="fs-caption mb-[5px] text-color-text-faded">Primary Button</p>
                    <PrimaryButton text='Primary Button'/>
                </div>
                <div className='mb-0'>
                    <p className="fs-caption mb-[5px] text-color-text-faded">Secondary Button</p>
                    <SecondaryButton text='Secondary Button'/>
                </div>
            </div>
        </section>
    </>
  );
};

export default StyleGuide;
