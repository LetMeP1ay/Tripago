import React, { useState } from 'react';

type User = {
    name: string;
    isPremium: boolean;
    loyaltyPoints: number;
};

const LoyaltyPoints: React.FC = () => {
    const [user, setUser] = useState<User>({
        name: 'Alice',
        isPremium: false,
        loyaltyPoints: 0,
    });

    const [itemPrice, setItemPrice] = useState<number>(0);

    const addLoyaltyPoints = (price: number) => {
        let points = Math.floor(price / 100);

        if (user.isPremium) {
            points *= 2;
        }

        const updatedPoints = user.loyaltyPoints + points;

        setUser((prevUser) => ({
            ...prevUser,
            loyaltyPoints: updatedPoints,
        }));

        checkMilestones(updatedPoints);
    };

    const checkMilestones = (points: number) => {
        const milestones = [30, 70, 120];

        for (const milestone of milestones) {
            if (points >= milestone) {
                console.log(`${user.name} has reached ${milestone} loyalty points!`);
            }
        }
    };

    const handlePurchase = () => {
        addLoyaltyPoints(itemPrice);
    };

    return (
        <div>
            <h1>Loyalty Points System</h1>
            <p>User: {user.name}</p>
            <p>Premium Status: {user.isPremium ? 'Yes' : 'No'}</p>
            <p>Loyalty Points: {user.loyaltyPoints}</p>

            <div>
                <label>
                    Item Price:
                    <input
                        type="number"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(Number(e.target.value))}
                    />
                </label>
                <button onClick={handlePurchase}>Add Points</button>
            </div>
        </div>
    );
};

export default LoyaltyPoints;
