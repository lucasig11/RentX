import Car from '@modules/cars/infra/typeorm/entities/Car';
import FakeCarsImagesRepository from '@modules/cars/repositories/fakes/FakeCarsImagesRepository';
import FakeCarsRepository from '@modules/cars/repositories/fakes/FakeCarsRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

import UpdateCarImagesUseCase from './UpdateCarImagesUseCase';

let updateImages: UpdateCarImagesUseCase;
let fakeStorageProvider: FakeStorageProvider;
let fakeCarsRepository: FakeCarsRepository;
let fakeCarsImagesRepository: FakeCarsImagesRepository;
let car: Car;

describe('Update car images', () => {
    beforeEach(async () => {
        fakeCarsRepository = new FakeCarsRepository();
        fakeCarsImagesRepository = new FakeCarsImagesRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateImages = new UpdateCarImagesUseCase(
            fakeCarsImagesRepository,
            fakeCarsRepository,
            fakeStorageProvider
        );
        car = await fakeCarsRepository.create({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });
    });

    it("should be able to update a car's images", async () => {
        const filenames = ['image_1.png', 'image_2.png'];

        await updateImages.execute({
            car_id: car.id,
            filenames,
        });

        const car_images = await fakeCarsImagesRepository.findByCarId(car.id);

        expect(car_images.length).toBe(2);
    });

    it('should not be able to update the images of a unexisting car', async () => {
        const filenames = ['image_1.png', 'image_2.png'];
        await expect(
            updateImages.execute({
                car_id: 'invalid_id',
                filenames,
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should clear previous images before adding new ones', async () => {
        const deleteFileSpy = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const filenames = ['image_1.png', 'image_2.png'];

        await updateImages.execute({
            car_id: car.id,
            filenames,
        });

        const new_files = ['image_3.png', 'image_4.png', 'image_5.png'];

        await updateImages.execute({
            car_id: car.id,
            filenames: new_files,
        });

        const car_images = await fakeCarsImagesRepository.findByCarId(car.id);

        expect(car_images.length).toBe(3);
        expect(deleteFileSpy).toHaveBeenCalledWith('image_1.png', 'cars');
        expect(deleteFileSpy).toHaveBeenCalledWith('image_2.png', 'cars');
    });
});
