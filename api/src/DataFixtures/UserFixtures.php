<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture implements DependentFixtureInterface
{

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ){
    }

    const USER_REFERENCE = 'user';
    const USER_COUNT_REFERENCE = 10;
    const ROLE_ARRAY = [
        'ROLE_MEMBER',
        'ROLE_PHOTOGRAPHER',
        'ROLE_JURY',
        'ROLE_ADMIN',
    ];

    public function getRandomElements(array $array, int $count): array
    {
        shuffle($array);
        $randomElements = array_slice($array, 0, $count);
        return $randomElements;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::USER_COUNT_REFERENCE; $i++) {
            $user = new User();

            $user->setPseudonym($faker->userName());
            $user->setIsVerified($faker->boolean());
            $user->setLastConnectionDate($faker->dateTime());
            $user->setState($faker->boolean());
            $user->setRegistrationDate($faker->dateTime());
            $user->setDeleteDate($faker->dateTime());
            $user->setUpdateDate($faker->dateTime());
            $user->setWebsiteUrl($faker->url());
            $user->setPictureProfil($faker->imageUrl());
            $user->setPhotographerDescription($faker->text());
            $user->setSocialsNetworks($faker->text());
            $user->setEmail($faker->email());
            $user->setPassword($this->passwordHasher->hashPassword($user, 'test'));
            $user->setAddress($faker->address());
            $user->setPhoneNumber($faker->phoneNumber());
            $user->setDateOfBirth($faker->dateTime());
            $user->setState($faker->boolean());
            $user->setCreationDate($faker->dateTime());
            $user->setFirstname($faker->firstName());
            $user->setLastname($faker->lastName());
            $user->setRoles($this->getRandomElements(self::ROLE_ARRAY, 1));
            $user->setCity($faker->city());
            $user->setCountry("FRANCE");
            $user->setPostcode(str_replace(' ', '', $faker->postcode()));
            $user->setGender($this->getReference(GenderFixtures::GENDER_REFERENCE . rand(1, count(GenderFixtures::GENDER_ARRAY))));
            $user->setPhotographerCategory($this->getReference(PhotographerCategoryFixtures::PHOTOGRAPHER_CATEGORY_REFERENCE . rand(1, count(PhotographerCategoryFixtures::PHOTOGRAPHER_CATEGORY_ARRAY))));

            $manager->persist($user);

            $this->addReference(sprintf('%s%d', self::USER_REFERENCE, $i + 1), $user);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            GenderFixtures::class,
            PhotographerCategoryFixtures::class,
        ];
    }
}
