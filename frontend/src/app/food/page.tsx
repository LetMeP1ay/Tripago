"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { getCountryFromCoordinates, getUserCoords, getUserLocation } from "@/services/locationService";
=======
>>>>>>> 4c4171a972d8d79616e6acbdd238b439c920750c

interface FoodOffer {
    type: string;
    food: {
        type: string;
        foodId: string;
        name: string;
        cityCode: string;
<<<<<<< HEAD
        latitude: number;
        longitude: number;
    };
    available: boolean;
=======
    };
>>>>>>> 4c4171a972d8d79616e6acbdd238b439c920750c
    open: boolean;

    self: string;
}

export default function FindFood() {
<<<<<<< HEAD
    
    const router = useRouter();
    
    const query = new URLSearchParams(window.location.search);
    const cityCode = query.get("cityCode") || "";

    const [foodOffers, setFoodOffers] = useState<FoodOffer[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [foodImages, setFoodImages] = useState<Record<string, string[]>>({});
    const [latitude, setLatitude] = useState<number>();
    const [longitude, setLongitude] = useState<number>();

    useEffect(() => {
        const getLocation = async () => {
            if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            }, (error) => {
                if (error) {
                setLatitude(-36.8484611);
                setLongitude(174.7597086);
                }
            })
            }
        }; getLocation()
    }, []);
    
    
    console.log(latitude, longitude);
    
    const fetchFoodByLocation = async (): Promise<string[]> => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/food?cityCode=${cityCode}`
            );
            const data = await response.json();
            const FoodIds = data?.data?.map(
                (food: { foodId: string }) => food.foodId
            );
            return FoodIds;
        } catch (error) {
            console.error("Error fetching food by city:", error);
            setError("Failed to fetch food.");
            return [];
        }
    };

    const fetchInfoForFood = async (hotelOffers: FoodOffer[]) => {
        try {
          for (let offer of hotelOffers) {
            const { name, latitude, longitude } = offer.food;
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/hotel-images?hotelName=${name}&lat=${latitude}&lng=${longitude}`
            );
            const data = await response.json();
            setFoodImages((prevImages) => ({
              ...prevImages,
              [offer.food.foodId]: data.photos || [],
            }));
          }
        } catch (error) {
          console.error("Error fetching hotel images:", error);
        }
      };
=======
    const router = useRouter();

    const query = new URLSearchParams(window.location.search);
>>>>>>> 4c4171a972d8d79616e6acbdd238b439c920750c
    
    const gap = "15px";
    const desktopImgSize = "w-[300px] h-[220px]"
    const mobileImgSize = "w-[250px] h-[110px]"
    const numFeatured = 5;
    return (
        <div className={`px-[${gap}] py-[15px] flex-col justify-start items-center gap-[15px] inline-flex w-screen bg-white text-black`}>
        <div className="justify-between items-center inline-flex w-full">
<<<<<<< HEAD
            
=======
>>>>>>> 4c4171a972d8d79616e6acbdd238b439c920750c
            <div>
                <p>What Would you like to eat?</p>
            </div>
            
            <div className="px-[15px] py-2.5 bg-white rounded-[50px] border-2 border-black/10 items-center flex w-1/2">
            <div className="text-black/50 text-xs font-extrabold font-['Urbanist']">211B Baker Street</div>
            <img className="w-[15px] h-2.5" src="https://via.placeholder.com/15x10" />
            </div>
        </div>
        <div className="justify-between items-center inline-flex w-full gap-[15px]">
            <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
            <p>Search Food</p>
            </div>
        </div>
            <div className="justify-between items-center inline-flex w-full gap-[15px]">
                <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex"><p>Ratings</p></div>
                <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex"><p>Open Now</p></div>
                <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex"><p>Price</p></div>
            </div>

<<<<<<< HEAD
        <div>

            
        </div>

=======
>>>>>>> 4c4171a972d8d79616e6acbdd238b439c920750c
        <div className="pt-[30px]"> {/*whole food card*/} 
        <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink mx-4 text-gray-400"><h1>Denny{"\'"}s Hobson Street</h1></span>{/*Name*/} 
                <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="flex overflow-x-auto space-x-[15px] w-screen px-[15px]"> {/*Images*/}
                <div className={`${desktopImgSize} flex-shrink-0 rounded-[15px] justify-center items-center flex overflow-y-hidden`}> {/*Image Div*/}
                    <img className="w-[175] h-[175]" src="https://via.placeholder.com/400x400" />
                </div>
<<<<<<< HEAD
=======
                <div className={`${desktopImgSize} flex-shrink-0 rounded-[15px] justify-center items-center flex overflow-y-hidden`}> {/*Image Div*/}
                    <img className="w-[175] h-[175]" src="https://via.placeholder.com/400x400" />
                </div>
                <div className={`${desktopImgSize} flex-shrink-0 rounded-[15px] justify-center items-center flex overflow-y-hidden`}> {/*Image Div*/}
                    <img className="w-[175] h-[175]" src="https://via.placeholder.com/400x400" />
                </div>
                <div className={`${desktopImgSize} flex-shrink-0 rounded-[15px] justify-center items-center flex overflow-y-hidden`}> {/*Image Div*/}
                    <img className="w-[175] h-[175]" src="https://via.placeholder.com/400x400" />
                </div>
                <div className={`${desktopImgSize} flex-shrink-0 rounded-[15px] justify-center items-center flex overflow-y-hidden`}> {/*Image Div*/}
                    <img className="w-[175] h-[175]" src="https://via.placeholder.com/400x400" />
                </div>
                <div className={`${desktopImgSize} flex-shrink-0 rounded-[15px] justify-center items-center flex overflow-y-hidden`}> {/*Image Div*/}
                    <img className="w-[175] h-[175]" src="https://via.placeholder.com/400x400" />
                </div>
                <div className={`${desktopImgSize} flex-shrink-0 rounded-[15px] justify-center items-center flex overflow-y-hidden`}> {/*Image Div*/}
                    <img className="w-[175] h-[175]" src="https://via.placeholder.com/400x400" />
                </div>
>>>>>>> 4c4171a972d8d79616e6acbdd238b439c920750c
            </div> {/*Images End*/}
            <div> {/*Bio*/}
                <div className="justify-center items-between inline-flex flex-1 w-screen gap-[15px] px-[15px]"> {/*Information*/}
                    <div> {/*Rating*/} 
                        <p>3.5 ⭐⭐⭐⭐⭐ {"\("}2,293{"\)"},</p>
                    </div>
                    <div> {/*Price*/} 
                        <p>$$,</p>
                    </div>
                    <div> {/*Distance*/} 
                        <p>400m.</p>
                    </div>
                </div> {/*Information end*/} 
                <div className="justify-center items-between inline-flex flex-1 w-screen gap-[15px] px-[15px]"> {/*Information cont*/} 
                    <div>
                        <p>Fast Food,</p>
                    </div>
                    <div>
                        <p>51 Hobson St,</p>
                    </div>
                    <div>
                        <p>🧑‍🦽‍➡️</p>
                    </div>
                </div>{/*Information cont end*/} 
                <div className="justify-center items-between inline-flex flex-1 w-screen gap-[15px] px-[15px]"> {/*Opening info*/} 
                    <div>
                        <p>Open</p>
                    </div>
                    <div>
                        <p>-</p>
                    </div>
                    <div>
                        <p>Closes 10:30 pm</p>
                    </div>
                </div>
            </div>{/*Opening info end*/} 
            <div className="justify-center items-between inline-flex flex-1 w-screen gap-[15px] px-[15px]"> {/*Action Buttons*/} 
                <div className="w-1/2 justify-between items-center inline-flex gap-[15px]"> {/*Buttons (restricting to half the screen)*/} 
                    <div className="justify-between items-center inline-flex w-full gap-[15px]"> {/*buttons list */}
                        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex"><p>Directions</p></div>
                        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex"><p>Call</p></div>
                        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex"><p>Wishlist</p></div>
                    </div>
                </div>
            </div>{/*Action Buttons end*/} 
        </div> {/*whole food card end*/} 
<<<<<<< HEAD


=======
>>>>>>> 4c4171a972d8d79616e6acbdd238b439c920750c
        
        
        

        </div>
    );
  }