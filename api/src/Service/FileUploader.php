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

    public function upload(UploadedFile $file, string $code): array
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename . '-' . sha1(uniqid(mt_rand(), true)).'.'.$file->guessExtension();

        $mimeType = $file->getMimeType();
        $size = $file->getSize();
        $extension = $file->guessExtension();

        $file->move($this->getTargetDirectory($code), $fileName);

        return [
            'code' => $code,
            'path' => sprintf('uploads/%s/%s', $code, $fileName),
            'size' => $size,
            'extension' => $extension,
            'type' => $mimeType,
            'default_name' => $originalFilename
        ];
    }

    public function getTargetDirectory(string $code): string
    {
        return sprintf('%s/public/uploads/%s', $this->params->get('kernel.project_dir'), $code);
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

    public function unupload(string $code, string $path): void
    {
        unlink($this->getTargetDirectory($code) . '/' . $path);
    }
}
