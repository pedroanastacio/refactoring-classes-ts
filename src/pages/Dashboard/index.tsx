import { useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect } from 'react';

export interface FoodType {
  id: number
  name: string
  description: string
  price: string
  available: boolean
  image: string
}

export interface CreateFoodInput extends Omit<FoodType, 'id' | 'available'> {}

const Dashboard = () => {
  const [foods, setFoods] = useState<FoodType[]>([])
  const [editingFood, setEditingFood] = useState({} as FoodType)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

  useEffect(() => {
    async function fetchFoods() {
      const response = await api.get('/foods');
      setFoods(response.data)
    }

    fetchFoods()
  }, [])

  async function handleAddFood(food: CreateFoodInput) {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(state => [...state, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: CreateFoodInput) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }

  function toggleModal() {
    setModalOpen(state => !state)
  }

  function toggleEditModal() {
    setEditModalOpen(state => !state)
  }

  function handleEditFood(food: FoodType) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
