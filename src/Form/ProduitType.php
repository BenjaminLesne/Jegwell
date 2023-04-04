<?php

namespace App\Form;

use App\Entity\Product;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', null, [
                'label' => 'nom',
            ])
            ->add('description', null, [
                'label' => 'description',
            ])
            ->add('categories', null, [
                'label' => 'catégories',
            ])
            ->add('options', null, [
                'label' => 'options',
            ])
            ->add('relatedProducts', null, [
                'label' => 'produits associés',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}
