import React from 'react'

type Props = {
  name: string;
}

export const ProductCard = ({
  name,
}: Props) => {
  return (
    <div>Produit: {name} </div>
  )
}
