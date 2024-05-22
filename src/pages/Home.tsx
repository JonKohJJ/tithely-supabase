import PrimaryButton from "../components/Buttons/PrimaryButton";
import HeroImage from "../components/HeroImage/HeroImage";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect } from "react";


const Home = () => {

    const subscriptions: { [key: string]: TSubscriptionPlans } = {
        free: {
          name: 'Free',
          price: 0,
          features: ['Basic features', 'Limited access'],
        },
        moderate: {
          name: 'Moderate',
          price: 9.99,
          features: ['Enhanced features', 'Medium access'],
        },
        premium: {
          name: 'Premium',
          price: 19.99,
          features: ['All features', 'Unlimited access', 'Priority support'],
        },
    };

    const { user, session } = useAuthContext()

    // Calculate Height 
    const [sectionHeight, setSectionHeight] = useState(0)
    const calculateSectionHeight = () => {
        const homeNavBar = document.querySelector(".home-navigation-section")
        const mycontainer = document.querySelector(".mycontainer")

        if (homeNavBar && mycontainer) {
            const homeNavBarHeight = homeNavBar.clientHeight
            const newHeight = window.innerHeight - homeNavBarHeight - 48;
            setSectionHeight(newHeight);
        }
    }
    useEffect(() => {
        calculateSectionHeight()
        window.addEventListener("resize", calculateSectionHeight)
        return () => { window.removeEventListener("resize", calculateSectionHeight) }
    }, [])

    return (
        <section className="home flex justify-center">
            <div className="mycontainer flex">

                <div className="home-content laptop:w-[60%] laptop:pr-8">
                    <div className="mb-[100px] flex items-center" style={{ minHeight: `${sectionHeight}px` }}>
                        <div>
                            <p className='fs-h1 mb-[30px]'>
                                Welcome To Tithely!
                            </p>
            
                            <p className='fs-h3 mb-[30px]'>
                                Welcome to a world where financial management is not just a task — it&apos;s an empowering experience.
                            </p>

                            { !(user && session) ?
                                <PrimaryButton text="Log In To Get Started" destination="/tithely-supabase/login" />
                                :
                                <PrimaryButton text="Go To Dashboard" destination="/tithely-supabase/dashboard" />
                            }
                        </div>
                    </div>

                    <div className="mb-[100px] flex items-center" style={{ minHeight: `${sectionHeight}px` }}>
                        <div>
                            <div className="mb-[50px]">
                                <p className='fs-h2 mb-[20px]'>
                                    About Tithely
                                </p>
            
                                <p className='fs-h3'>
                                    Tithely is a powerful tool designed to empower you on your financial journey. In a world filled with financial complexities, our application strives to simplify the way you manage and monitor your finances, providing you with the clarity and control you need to achieve your financial goals.
                                </p>
                            </div>
            
                            <div>
                                <p className='fs-h2 mb-[20px]'>
                                    How we came about
                                </p>
            
                                <p className='fs-h3'>
                                    In the realm of personal finance, I embarked on a solo journey fueled by nothing but passion—a journey that would eventually give birth to Tithely. 
                                    As a one-person team, I set out to create a software-as-a-service solution that transcends the mundane and empowers individuals to navigate their financial landscapes with confidence and clarity.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-[100px] flex items-center" style={{ minHeight: `${sectionHeight}px` }}>
                        <div className="w-full">
                            <p className='fs-h2 mb-[20px]'>Pricing Plans</p>
                            <div className="flex flex-col gap-8 laptop:flex-row">
                                {Object.keys(subscriptions).map((subscriptionKey) => (
                    
                                    <div key={subscriptionKey} className="p-6 rounded border-solid border-color-border border-[1px] w-full flex flex-col">
                                        <p className="fs-h3 mb-1">{subscriptions[subscriptionKey].name}</p>
                                        <p className="text-color-text-faded fs-base">${subscriptions[subscriptionKey].price.toFixed(2)} / month</p>

                                        <ul className="mt-8 mb-14">
                                            {subscriptions[subscriptionKey].features.map((feature, index) => (
                                                <li key={index} className="w-full mb-1">
                                                    ∙ {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <div className="mt-[auto]">
                                            <p className="fs-caption text-red-500 mb-2 font-medium">*Coming Soon</p>
                                            <PrimaryButton text='Select Plan' additionalClasses='w-full opacity-40 cursor-not-allowed'></PrimaryButton>
                                        </div>

                                    </div>
                
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <HeroImage />
            </div>
        </section>
    )
}

export default Home

// Subscription Plans
export type TSubscriptionPlans = {
    name: string;
    price: number;
    features: string[];
}