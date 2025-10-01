import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Utensils, Calculator } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock food database
const FOODS_DATABASE = [
  { id: 1, name: "دجاج مشوي", protein: 31, carbohydrates: 0, fats: 3.6, fiber: 0, calories: 165, quantity: "100g", suitable_for_diabetes: true },
  { id: 2, name: "أرز بني", protein: 2.6, carbohydrates: 23, fats: 0.9, fiber: 1.8, calories: 112, quantity: "100g", suitable_for_diabetes: true },
  { id: 3, name: "سلمون مدخن", protein: 25, carbohydrates: 0, fats: 4.3, fiber: 0, calories: 142, quantity: "100g", suitable_for_diabetes: true },
  { id: 4, name: "خبز أبيض", protein: 9, carbohydrates: 49, fats: 3.2, fiber: 2.7, calories: 265, quantity: "100g", suitable_for_diabetes: false },
  { id: 5, name: "بروكلي", protein: 2.8, carbohydrates: 7, fats: 0.4, fiber: 2.6, calories: 34, quantity: "100g", suitable_for_diabetes: true },
  { id: 6, name: "تونة معلبة", protein: 29, carbohydrates: 0, fats: 1.3, fiber: 0, calories: 132, quantity: "100g", suitable_for_diabetes: true },
  { id: 7, name: "موز", protein: 1.1, carbohydrates: 23, fats: 0.3, fiber: 2.6, calories: 89, quantity: "100g", suitable_for_diabetes: false },
  { id: 8, name: "لوز", protein: 21, carbohydrates: 22, fats: 49, fiber: 12, calories: 576, quantity: "100g", suitable_for_diabetes: true },
  { id: 9, name: "بيض مسلوق", protein: 13, carbohydrates: 1.1, fats: 11, fiber: 0, calories: 155, quantity: "100g", suitable_for_diabetes: true },
  { id: 10, name: "أفوكادو", protein: 2, carbohydrates: 9, fats: 15, fiber: 7, calories: 160, quantity: "100g", suitable_for_diabetes: true },
];

interface FoodItem {
  id: number;
  name: string;
  protein: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
  calories: number;
  quantity: string;
  suitable_for_diabetes: boolean;
}

interface MealFood extends FoodItem {
  mealItemId: string;
}

interface MealTotals {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
}

const NutritionPlan: React.FC = () => {
  const [meals, setMeals] = useState<{
    meal1: MealFood[];
    meal2: MealFood[];
    meal3: MealFood[];
  }>({
    meal1: [],
    meal2: [],
    meal3: [],
  });

  const [selectedFoods, setSelectedFoods] = useState<{
    meal1: string;
    meal2: string;
    meal3: string;
  }>({
    meal1: "",
    meal2: "",
    meal3: "",
  });

  const calculateTotals = useCallback((mealFoods: MealFood[]): MealTotals => {
    return mealFoods.reduce(
      (totals, food) => ({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbohydrates: totals.carbohydrates + food.carbohydrates,
        fats: totals.fats + food.fats,
        fiber: totals.fiber + food.fiber,
      }),
      { calories: 0, protein: 0, carbohydrates: 0, fats: 0, fiber: 0 }
    );
  }, []);

  const addFoodToMeal = useCallback((mealType: keyof typeof meals, foodId: string) => {
    if (!foodId) return;

    const food = FOODS_DATABASE.find(f => f.id === parseInt(foodId));
    if (!food) return;

    const mealFood: MealFood = {
      ...food,
      mealItemId: `${mealType}-${Date.now()}-${Math.random()}`,
    };

    setMeals(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], mealFood],
    }));

    setSelectedFoods(prev => ({
      ...prev,
      [mealType]: "",
    }));

    toast({
      title: "تم إضافة الطعام بنجاح",
      description: `تم إضافة ${food.name} إلى ${getMealTitle(mealType)}`,
      duration: 2000,
    });
  }, []);

  const removeFoodFromMeal = useCallback((mealType: keyof typeof meals, mealItemId: string) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(food => food.mealItemId !== mealItemId),
    }));

    toast({
      title: "تم حذف الطعام",
      description: "تم إزالة الطعام من الوجبة بنجاح",
      duration: 2000,
    });
  }, []);

  const getMealTitle = (mealType: string): string => {
    const titles = {
      meal1: "وجبة 1",
      meal2: "وجبة 2", 
      meal3: "وجبة 3",
    };
    return titles[mealType as keyof typeof titles] || mealType;
  };

  const renderMealSection = (mealType: keyof typeof meals) => {
    const mealFoods = meals[mealType];
    const totals = calculateTotals(mealFoods);

    return (
      <Card key={mealType} className="bg-card border-border shadow-soft hover:shadow-medium transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Utensils className="h-5 w-5 text-primary" />
            </div>
            {getMealTitle(mealType)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Food Section */}
          <div className="flex gap-3 items-center">
            <Select
              value={selectedFoods[mealType]}
              onValueChange={(value) => setSelectedFoods(prev => ({ ...prev, [mealType]: value }))}
            >
              <SelectTrigger className="flex-1 bg-background border-border focus-ring">
                <SelectValue placeholder="اختر طعاماً لإضافته..." />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover text-popover-foreground border-border shadow-medium max-h-60 overflow-y-auto">
                {FOODS_DATABASE.map((food) => (
                  <SelectItem 
                    key={food.id} 
                    value={food.id.toString()}
                    className="flex justify-between items-center py-3 hover:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{food.name}</span>
                      <Badge 
                        variant={food.suitable_for_diabetes ? "default" : "destructive"}
                        className="mr-2"
                      >
                        {food.suitable_for_diabetes ? "✅" : "❌"}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="nutrition"
              onClick={() => addFoodToMeal(mealType, selectedFoods[mealType])}
              disabled={!selectedFoods[mealType]}
              className="add-food-btn shrink-0"
            >
              <Plus className="h-4 w-4" />
              إضافة طعام
            </Button>
          </div>

          {/* Food Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" dir="rtl">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-3 text-right font-semibold text-muted-foreground">الألياف</th>
                    <th className="p-3 text-right font-semibold text-muted-foreground">الدهون</th>
                    <th className="p-3 text-right font-semibold text-muted-foreground">الكربوهيدرات</th>
                    <th className="p-3 text-right font-semibold text-muted-foreground">البروتين</th>
                    <th className="p-3 text-right font-semibold text-muted-foreground">السعرات</th>
                    <th className="p-3 text-right font-semibold text-muted-foreground">الكمية</th>
                    <th className="p-3 text-right font-semibold text-muted-foreground">للسكر</th>
                    <th className="p-3 text-right font-semibold text-muted-foreground">الطعام</th>
                    <th className="p-3 text-right font-semibold text-muted-foreground">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {mealFoods.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-muted-foreground">
                        لم يتم إضافة أي طعام لهذه الوجبة بعد
                      </td>
                    </tr>
                  ) : (
                    mealFoods.map((food) => (
                      <tr key={food.mealItemId} className="nutrition-table-row border-b border-border/50">
                        <td className="p-3 text-center">{food.fiber.toFixed(1)}g</td>
                        <td className="p-3 text-center">{food.fats.toFixed(1)}g</td>
                        <td className="p-3 text-center">{food.carbohydrates.toFixed(1)}g</td>
                        <td className="p-3 text-center">{food.protein.toFixed(1)}g</td>
                        <td className="p-3 text-center font-semibold text-nutrition">{food.calories}</td>
                        <td className="p-3 text-center text-muted-foreground">{food.quantity}</td>
                        <td className="p-3 text-center">
                          <Badge variant={food.suitable_for_diabetes ? "default" : "destructive"}>
                            {food.suitable_for_diabetes ? "✅" : "❌"}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-medium">{food.name}</td>
                        <td className="p-3 text-center">
                          <Button
                            variant="delete"
                            size="xs"
                            onClick={() => removeFoodFromMeal(mealType, food.mealItemId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Card */}
          {mealFoods.length > 0 && (
            <Card className="totals-card bg-gradient-subtle border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-foreground">إجمالي العناصر الغذائية</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4" dir="rtl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-nutrition">{totals.calories.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">سعرة حرارية</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totals.protein.toFixed(1)}g</div>
                    <div className="text-xs text-muted-foreground">بروتين</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totals.carbohydrates.toFixed(1)}g</div>
                    <div className="text-xs text-muted-foreground">كربوهيدرات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totals.fats.toFixed(1)}g</div>
                    <div className="text-xs text-muted-foreground">دهون</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totals.fiber.toFixed(1)}g</div>
                    <div className="text-xs text-muted-foreground">ألياف</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  };

  const grandTotals = calculateTotals([...meals.meal1, ...meals.meal2, ...meals.meal3]);

  return (
    <div className="min-h-screen bg-gradient-subtle p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-health bg-clip-text text-transparent">
            نظام التغذية المخصص
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            خطط وجباتك اليومية بذكاء واحسب العناصر الغذائية بدقة لتحقيق أهدافك الصحية
          </p>
        </div>

        {/* Meals Grid */}
        <div className="grid gap-8 lg:grid-cols-1 xl:grid-cols-1">
          {renderMealSection("meal1")}
          {renderMealSection("meal2")}
          {renderMealSection("meal3")}
        </div>

        {/* Grand Totals */}
        {(meals.meal1.length > 0 || meals.meal2.length > 0 || meals.meal3.length > 0) && (
          <Card className="bg-gradient-primary text-primary-foreground shadow-strong">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">إجمالي اليوم الكامل</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{grandTotals.calories.toFixed(0)}</div>
                    <div className="text-sm opacity-90">سعرة حرارية</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{grandTotals.protein.toFixed(1)}g</div>
                    <div className="text-sm opacity-90">بروتين</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{grandTotals.carbohydrates.toFixed(1)}g</div>
                    <div className="text-sm opacity-90">كربوهيدرات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{grandTotals.fats.toFixed(1)}g</div>
                    <div className="text-sm opacity-90">دهون</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{grandTotals.fiber.toFixed(1)}g</div>
                    <div className="text-sm opacity-90">ألياف</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NutritionPlan;