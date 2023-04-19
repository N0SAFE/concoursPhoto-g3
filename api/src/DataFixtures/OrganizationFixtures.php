<?php

namespace App\DataFixtures;

use App\Entity\File;
use App\Entity\Organization;
use App\Entity\OrganizationType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class OrganizationFixtures extends Fixture implements DependentFixtureInterface
{

    public function __construct(){
        $this->faker = Factory::create('fr_FR');
    }

    const ORGANIZATION_REFERENCE = 'organization';
    const ORGANIZATION_COUNT_REFERENCE = 10;
    const CITY_ARRAY = [
        '60341', '01032', '46201', '24008', '02347', '06055', '34343', '66025', '80829', '51578',
    ];

    const PICTURE_ARRAY = [
        "698-2160-2160.jpg",
        "814-2160-2160.jpg",
        "904-2160-2160.jpg",
        "952-2160-2160.jpg",
        "12839c32a07ad619a08ccaec9d21c241b732d40d.Capture d'écran 2023-03-22 154847.png"
    ];

    public function createFile() {
        $file = new File();

        $file->setExtension($this->faker->fileExtension());
        $file->setPath("fixtures-upload/" . self::PICTURE_ARRAY[rand(0, count(self::PICTURE_ARRAY) - 1)]);
        $file->setSize($this->faker->randomNumber());
        $file->setType($this->faker->mimeType());
        $file->setDefaultName($this->faker->name());

        return $file;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = $this->faker;

        for ($i = 0; $i < self::ORGANIZATION_COUNT_REFERENCE; $i++) {
            $organization = new Organization();

            $organization->setState($faker->boolean());
            $organization->setOrganizerName($faker->text());
            $organization->setDescription($faker->text());
            $organization->setLogo($this->createFile());
            $organization->setAddress($faker->address());
            $organization->setPostcode(str_replace(' ', '', $faker->postcode()));
            $organization->setCity(self::CITY_ARRAY[rand(0, count(self::CITY_ARRAY) - 1)]);
            $organization->setWebsiteUrl($faker->url());
            $organization->setEmail($faker->email());
            $organization->setNumberPhone($faker->phoneNumber());
            $organization->setCountry("FRANCE");
            $organization->setIntraCommunityVat($faker->creditCardNumber());
            $organization->setNumberSiret($faker->creditCardNumber());
            $organization->setOrganizationType($this->getReference(OrganizationTypeFixtures::ORGANIZATION_TYPE_REFERENCE . rand(1, count(OrganizationTypeFixtures::ORGANIZATION_TYPE_ARRAY))));

            $manager->persist($organization);

            $this->addReference(sprintf('%s%d', self::ORGANIZATION_REFERENCE, $i + 1), $organization);
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
