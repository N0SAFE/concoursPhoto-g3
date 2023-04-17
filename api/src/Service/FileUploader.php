<?php
// src/Service/FileUploader.php
namespace App\Service;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileUploader
{
    CONST USERS = 'users';
    CONST COMPETITIONS = 'competitions';
    CONST ORGANIZATIONS = 'organizations';
    CONST SPONSORS = 'sponsors';

    public function __construct(
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ){
    }

    public function upload(UploadedFile $file): array
    {
        $originalFilename = $file->getClientOriginalName();
        $fileName = sha1(uniqid(mt_rand(), true)).'.'.$file->getClientOriginalName();

        $mimeType = $file->getMimeType();
        $size = $file->getSize();
        $extension = $file->guessExtension();
        if (!$extension) {
            $extension = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);;
        }
        if (!$extension) {
            $extension = '';
        }

        $file->move($this->getTargetDirectory(), $fileName);

        return [
            'path' => sprintf('uploads/%s', $fileName),
            'size' => $size,
            'extension' => $extension,
            'type' => $mimeType,
            'default_name' => $originalFilename
        ];
    }

    public function getTargetDirectory(): string
    {
        return sprintf('%s/public/uploads', $this->params->get('kernel.project_dir'));
    }

    public function getAlloweds(): array
    {
        return [
            self::USERS,
            self::COMPETITIONS,
            self::ORGANIZATIONS,
            self::SPONSORS
        ];
    }

    public function unupload(string $path): void
    {
        unlink($this->getTargetDirectory() . '/' . $path);
    }
}
