<?php

namespace App\DataFixtures;

use App\Entity\File;
use Faker\Factory;

class FileFixtures
{

    const PICTURE_ARRAY = [
        "698-2160-2160.jpg",
        "814-2160-2160.jpg",
        "952-2160-2160.jpg",
        "72257612_2666677870058419_3627953972688614250_n.jpg",
        "75265152_723455308065112_4940295927495026626_n.jpg",
        "88132150_1561164974046869_6348831809904382520_n.jpg",
        "91157897_104838091089262_5655408249652328241_n.jpg",
        "91363667_220406069034581_4307739713603084666_n.jpg",
        "91621184_2573113526341666_2628102595468359781_n.jpg",
        "91799523_221469222427031_7727537744597854209_n.jpg",
        "92032453_531721334154972_7187231337799729352_n.jpg",
        "93807586_656985081817428_95171704339107974_n.jpg",
        "93989634_222544272308685_8189241381165767425_n.jpg",
        "97116492_385843769051326_3688258174191308847_n.jpg",
        "100987884_557345381631023_713271402294150630_n.jpg",
        "101550813_255852082318509_1112282079756336416_n.jpg",
        "105985351_900224840457136_7376653245052849776_n.jpg",
        "106030639_150778703220084_4264419186627733463_n.jpg",
        "106382012_342739600048802_929369191339747776_n.jpg",
        "106576387_313047433417483_8954832261002205522_n.jpg",
        "107029872_258991375400616_2639351151147036980_n.jpg",
        "109282688_305400794176083_922877091227097039_n.jpg",
        "116794689_587432975300396_5266142348447653520_n.jpg",
        "117718761_1002781896835533_3451273753175570879_n.jpg",
        "118153599_300502161245910_3101322455217108463_n.jpg",
        "118440018_656054778624083_6760251980992551221_n.jpg",
        "119048969_375051070563575_4804765792867923713_n.jpg",
        "139394000_1338057863229522_3488234255299369578_n.jpg", 
        "167442226_736806120316536_6612058052377257061_n.jpg",
        "209995166_540212760666780_6932273087554734243_n.jpg",
        "211437146_396416698479684_4905250812382395643_n.jpg"
    ];

    const COMPETITION_LOGO_ARRAY = [
        "chromatic_awards_2023.jpg",
        "SeekPng.com_win-prizes-png_3175464.png",
        "téléchargement.jfif",
        "APA-Annual-Photo-Awards-2023.png",
        "93421013_2711733675726449_5229012650438723728_n.jpg",
        "93519212_543915033212322_4603255272770224173_n.jpg",
        "93795348_109679020542294_1944115282404285593_n.jpg"
    ];

    const SPONSOR_LOGO_ARRAY = [
        "coca.png",
        "pepsi.png",
        "ytb.png",
        "adidas.png",
        "amazon.png",
    ];

    const USER_LOGO_ARRAY = [
        "user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg",
        "5550850.jfif",
        "761456.png",
        "124599.jfif",
        "904-2160-2160.jpg",
        "12839c32a07ad619a08ccaec9d21c241b732d40d.Capture d'écran 2023-03-22 154847.png",
        "93811699_234940377885820_934587314583685535_n.jpg"
    ];

    const ORGANISATION_LOGO_ARRAY = [
        "pngegg.png",
        "pngwing.com.png",
        "vecteezy_social-organization-logo-social-community-logo-template_15277729.jpg",
        "27210784.jpg"
    ];

    const ORGANISATION_VIUAL_ARRAY = [
        "maxresdefault.jpg",
        "inspiring-company-mission-statements-1.webp",
        "images.png",
        "gmile-logo.jpg",
        "5573b597105005.5ebd5df148c5d.jpg"
    ];

    public function createFileFromArray(array $array)
    {
        $faker = Factory::create('fr_FR');
        $file = new File();

        $file->setExtension($faker->fileExtension());
        $file->setPath("fixtures-upload/" . $array[rand(0, count($array) - 1)]);
        $file->setSize($faker->randomNumber());
        $file->setType($faker->mimeType());
        $file->setDefaultName($faker->name());

        return $file;
    }
    
    public function createFileFromString(string $string)
    {
        $faker = Factory::create('fr_FR');
        $file = new File();

        $file->setExtension($faker->fileExtension());
        $file->setPath("fixtures-upload/" . $string);
        $file->setSize($faker->randomNumber());
        $file->setType($faker->mimeType());
        $file->setDefaultName($faker->name());

        return $file;
    }

    public function load()
    {
    }
}
