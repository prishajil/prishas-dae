print("Hello! This is the Weather Wardrobe Advisor")
temperature = input("What's the current temperature? ")
temperature = float(temperature)

if temperature <= 45:
    print("Wear warm layers like sweaters and jackets.")
    
    rain_snow = input("Is it rainy or snowy? (yes/no): ")
    if rain_snow == "yes":
        print("Bring a rain jacket, thick jacket, or umbrella.") 
    if rain_snow == "no":
        print("No precipitation items are needed.") 
        
    windy = input("Is it windy? (yes/no): ")
    if windy == "yes":
        print("Wear long pants or a windbreaker jacket.") 
    if windy == "no":
        print("No wind adjustments are necessary.")

if temperature > 45 and temperature <= 60:
    print("Wear light layers like a long sleeve shirt, light sweater, and thin pants.")
    
    rain_snow = input("Is it rainy or snowy? (yes/no): ")
    if rain_snow == "yes":
        print("Bring a rain jacket, thick jacket, or umbrella.")
    if rain_snow == "no":
        print("No precipitation items are needed.")
        
    windy = input("Is it windy? (yes/no): ")
    if windy == "yes":
        print("Wear long pants or a windbreaker jacket.")
    if windy == "no":
        print("No wind adjustments are necessary.")

if temperature > 60 and temperature <= 80:
    print("Wear light clothing like t-shirts and lightweight pants.")
    
    rain_snow = input("Is it rainy or snowy? (yes/no): ")
    if rain_snow == "yes":
        print("Bring a rain jacket, thick jacket, or umbrella.")
    if rain_snow == "no":
        print("No precipitation items are needed.")
        
    windy = input("Is it windy? (yes/no): ")
    if windy == "yes":
        print("Wear long pants or a windbreaker jacket.")
    if windy == "no":
        print("No wind adjustments are necessary.")

if temperature > 80:
    print("Wear summery and ventilated clothing like athletic shirts and shorts.")
    
    humid = input("Is it humid outside? (yes/no): ")
    if humid == "yes":
        print("Bring a bottle of cool water and sweat gear like a portable fan.")
    if humid == "no":
        print("No humidity protection necessary, but still consider bringing cool water.")
        
    sunny = input("Is it sunny outside? (yes/no): ")
    if sunny == "yes":
        print("Bring sunglasses, a cap, and sun protection.")
    if sunny == "no":
        print("No sun protection needed.")

print("End of program. Have a great day!")