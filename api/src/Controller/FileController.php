<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use App\Entity\File;
use App\Service\FileUploader;

#[AsController]
class FileController extends AbstractController
{
    const PICTURES_FILE_SIZE = 'picturesFileSize';
    const COMPETITION_FILE_SIZE = 'competitionFileSize';

    public function __invoke(Request $request, FileUploader $fileUploader): File
    {
        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }

        try {
            $fileOptions = $fileUploader->upload($uploadedFile);
        } catch (\Exception $e) {
            throw new BadRequestHttpException($e->getMessage());
        }

        $file = new File();

        match ($request->attributes->get('_api_operation_name')) {
            self::PICTURES_FILE_SIZE => $fileOptions['size'] < 1000000 ? $file->setSize($fileOptions['size']) : throw new \RuntimeException(
                sprintf('File size is too big.')
            ),
            self::COMPETITION_FILE_SIZE => $fileOptions['size'] < 2000000 ? $file->setSize($fileOptions['size']) : throw new \RuntimeException(
                sprintf('File size is too big.')
            ),
            default => $file->setSize($fileOptions['size']),
        };

        $file->setPath($fileOptions['path']);
        $file->setType($fileOptions['type']);
        $file->setDefaultName($fileOptions['default_name']);

        match ($fileOptions['extension']) {
            'jpg', 'png' => $file->setExtension($fileOptions['extension']),
            default => throw new \RuntimeException(
                sprintf('File extension is not allowed.')
            ),
        };

        return $file;
    }
}
