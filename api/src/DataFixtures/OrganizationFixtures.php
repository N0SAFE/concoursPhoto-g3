<?php

namespace App\DataFixtures;

use App\Entity\Organization;
use App\Entity\OrganizationType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class OrganizationFixtures extends Fixture implements DependentFixtureInterface
{
    const ORGANIZATION_REFERENCE = 'organization';
    const ORGANIZATION_COUNT_REFERENCE = 20;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::ORGANIZATION_COUNT_REFERENCE; $i++) {
            $organization = new Organization();

            $organization->setState($faker->boolean());
            $organization->setOrganizerName($faker->text());
            $organization->setDescription($faker->text());
            $organization->setLogo($faker->imageUrl());
            $organization->setAddress($faker->address());
            $organization->setPostcode(str_replace(' ', '', $faker->postcode()));
            $organization->setCity($faker->city());
            $organization->setWebsiteUrl($faker->url());
            $organization->setEmail($faker->email());
            $organization->setNumberPhone($faker->phoneNumber());
            $organization->setCountry("FRANCE");
            $organization->setOrganizationType($this->getReference(OrganizationTypeFixtures::ORGANIZATION_TYPE_REFERENCE . rand(1, count(OrganizationTypeFixtures::ORGANIZATION_TYPE_ARRAY))));

            $manager->persist($organization);

            $this->addReference(sprintf('%s%d', self::ORGANIZATION_REFERENCE, $i), $organization);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            OrganizationTypeFixtures::class,
        ];
    }
}
