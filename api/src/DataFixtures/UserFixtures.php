<?php

namespace App\DataFixtures;

use App\Entity\File;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture implements DependentFixtureInterface
{
    private $faker;

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
        $this->faker = Factory::create('fr_FR');
    }

    const USER_REFERENCE = 'user';
    const USER_COUNT_REFERENCE = 60;
    const ROLE_ARRAY = [
        'ROLE_MEMBER',
        'ROLE_PHOTOGRAPHER',
        'ROLE_JURY',
        'ROLE_ADMIN',
        'ROLE_ORGANIZER',
    ];

    const CITY_ARRAY = [
        [
            'code' => '60341',
            'codeDepartment' => '60',
            'codeRegion' => '32',
            'codePostal' => '60330',
        ],
        [
            'code' => '01032',
            'codeDepartment' => '01',
            'codeRegion' => '84',
            'codePostal' => '01360',
        ],
        [
            'code' => '46201',
            'codeDepartment' => '46',
            'codeRegion' => '76',
            'codePostal' => '46800',
        ],
        [
            'code' => '24008',
            'codeDepartment' => '24',
            'codeRegion' => '75',
            'codePostal' => '24270',
        ],
        [
            'code' => '02347',
            'codeDepartment' => '02',
            'codeRegion' => '32',
            'codePostal' => '02400',
        ],
        [
            'code' => '06055',
            'codeDepartment' => '06',
            'codeRegion' => '93',
            'codePostal' => '06670',
        ],
        [
            'code' => '34343',
            'codeDepartment' => '34',
            'codeRegion' => '76',
            'codePostal' => '34380',
        ],
        [
            'code' => '66025',
            'codeDepartment' => '66',
            'codeRegion' => '76',
            'codePostal' => '66760',
        ],
        [
            'code' => '80829',
            'codeDepartment' => '80',
            'codeRegion' => '32',
            'codePostal' => '80190',
        ],
        [
            'code' => '51578',
            'codeDepartment' => '51',
            'codeRegion' => '44',
            'codePostal' => '51130',
        ],
    ];

    public function getRandomElements(array $array, int $count): array
    {
        shuffle($array);
        $randomElements = array_slice($array, 0, $count);
        return $randomElements;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = $this->faker;

        $city = self::CITY_ARRAY[rand(0, count(self::CITY_ARRAY) - 1)];

        $user = new User();

        $user->setPseudonym('admin');
        $user->setIsVerified(true);
        $user->setLastConnectionDate($faker->dateTime());
        $user->setActive(true);
        $user->setRegistrationDate($faker->dateTime());
        $user->setDeleteDate($faker->dateTime());
        $user->setUpdateDate($faker->dateTime());
        $user->setWebsiteUrl($faker->url());
        $user->setPhotographerDescription($faker->text());
        $user->setEmail('admin@admin.com');
        $user->setPassword($this->passwordHasher->hashPassword($user, 'test'));
        $user->setAddress($faker->address());

        $phoneNumber = preg_replace(
            '/\s+/',
            '',
            str_replace(['+33', '(0)', ' '], ['0', '', ''], $faker->phoneNumber)
        );
        $user->setPhoneNumber($phoneNumber);

        $user->setDateOfBirth($faker->dateTime());
        $user->setCreationDate($faker->dateTime());
        $user->setFirstname($faker->firstName());
        $user->setLastname($faker->lastName());
        $user->setRoles(['ROLE_ADMIN']);
        $user->setCitycode($city['code']);
        $user->setDepartment($city['codeDepartment']);
        $user->setRegion($city['codeRegion']);
        $user->setPostcode($city['codePostal']);
        $user->setCountry($faker->countryCode());
        $user->setPictureProfil(
            (new FileFixtures())->createFileFromString('77668394.jfif')
        );
        $user->setGender(
            $this->getReference(
                GenderFixtures::GENDER_REFERENCE .
                    rand(1, count(GenderFixtures::GENDER_ARRAY))
            )
        );
        $user->setPhotographerCategory(
            $this->getReference(
                PhotographerCategoryFixtures::PHOTOGRAPHER_CATEGORY_REFERENCE .
                    rand(
                        1,
                        count(
                            PhotographerCategoryFixtures::PHOTOGRAPHER_CATEGORY_ARRAY
                        )
                    )
            )
        );
        $user->setPersonalStatut(
            $this->getReference(
                PersonalStatutFixtures::PERSONAL_STATUT_REFERENCE .
                    rand(
                        1,
                        count(PersonalStatutFixtures::PERSONAL_STATUT_ARRAY)
                    )
            )
        );
        $user->addManage(
            $this->getReference(
                OrganizationFixtures::ORGANIZATION_REFERENCE .
                    rand(1, OrganizationFixtures::ORGANIZATION_COUNT_REFERENCE)
            )
        );
        $managedOrganizationCount = rand(3, 5);
        for ($j = 0; $j < $managedOrganizationCount; $j++) {
            $user->addManage(
                $this->getReference(
                    OrganizationFixtures::ORGANIZATION_REFERENCE .
                        rand(
                            1,
                            OrganizationFixtures::ORGANIZATION_COUNT_REFERENCE
                        )
                )
            );
        }

        $manager->persist($user);

        $this->addReference(sprintf('%s%d', self::USER_REFERENCE, 1), $user);

        for ($i = 1; $i < self::USER_COUNT_REFERENCE; $i++) {
            $city = self::CITY_ARRAY[rand(0, count(self::CITY_ARRAY) - 1)];

            $user = new User();

            $user->setPseudonym($faker->userName());
            $user->setIsVerified($faker->boolean());
            $user->setLastConnectionDate($faker->dateTime());
            $user->setRegistrationDate($faker->dateTime());
            $user->setDeleteDate($faker->dateTime());
            $user->setUpdateDate($faker->dateTime());
            $user->setWebsiteUrl($faker->url());
            $user->setPhotographerDescription($faker->text());
            $user->setEmail($faker->email());
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, 'test')
            );
            $user->setAddress($faker->address());

            $phoneNumber = preg_replace(
                '/\s+/',
                '',
                str_replace(
                    ['+33', '(0)', ' '],
                    ['0', '', ''],
                    $faker->phoneNumber
                )
            );
            $user->setPhoneNumber($phoneNumber);

            $user->setDateOfBirth($faker->dateTime());
            $user->setActive($faker->boolean());
            $user->setCreationDate($faker->dateTime());
            $user->setFirstname($faker->firstName());
            $user->setLastname($faker->lastName());
            $user->setRoles($this->getRandomElements(self::ROLE_ARRAY, 1));
            $user->setCitycode($city['code']);
            $user->setDepartment($city['codeDepartment']);
            $user->setRegion($city['codeRegion']);
            $user->setCountry('FRANCE');
            $user->setPostcode($city['codePostal']);
            $user->setPictureProfil(
                (new FileFixtures())->createFileFromArray(
                    FileFixtures::USER_LOGO_ARRAY
                )
            );
            $user->setGender(
                $this->getReference(
                    GenderFixtures::GENDER_REFERENCE .
                        rand(1, count(GenderFixtures::GENDER_ARRAY))
                )
            );
            $user->setPhotographerCategory(
                $this->getReference(
                    PhotographerCategoryFixtures::PHOTOGRAPHER_CATEGORY_REFERENCE .
                        rand(
                            1,
                            count(
                                PhotographerCategoryFixtures::PHOTOGRAPHER_CATEGORY_ARRAY
                            )
                        )
                )
            );
            $user->setPersonalStatut(
                $this->getReference(
                    PersonalStatutFixtures::PERSONAL_STATUT_REFERENCE .
                        rand(
                            1,
                            count(PersonalStatutFixtures::PERSONAL_STATUT_ARRAY)
                        )
                )
            );
            $managedOrganizationCount = rand(0, 5);
            for ($j = 0; $j < $managedOrganizationCount; $j++) {
                $user->addManage(
                    $this->getReference(
                        OrganizationFixtures::ORGANIZATION_REFERENCE .
                            rand(
                                1,
                                OrganizationFixtures::ORGANIZATION_COUNT_REFERENCE
                            )
                    )
                );
            }

            foreach (
                NotificationTypeFixtures::NOTIFICATION_TYPE_ARRAY
                as $notificationType
            ) {
                if (rand(0, 3) == 3) {
                    $user->addNotificationEnabled(
                        $this->getReference(
                            NotificationTypeFixtures::NOTIFICATION_TYPE_REFERENCE .
                                $notificationType[1]
                        )
                    );
                }
            }

            $manager->persist($user);

            $this->addReference(
                sprintf('%s%d', self::USER_REFERENCE, $i + 1),
                $user
            );
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            GenderFixtures::class,
            PhotographerCategoryFixtures::class,
            PersonalStatutFixtures::class,
            NotificationTypeFixtures::class,
        ];
    }
}
