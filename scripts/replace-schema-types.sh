#!/bin/bash

# Script to replace Amplify Schema types with new types from @/lib/types

echo "Replacing Schema types with new types..."

# Find all TypeScript and TSX files in the app directory
find ../app -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" | while read file; do
  # Check if file contains Schema references
  if grep -q "Schema\[" "$file"; then
    echo "Processing: $file"

    # Create a backup
    cp "$file" "$file.bak"

    # Replace Schema["Product"]["type"] with Product
    sed -i '' 's/Schema\["Product"\]\["type"\]/Product/g' "$file"

    # Replace Schema["Order"]["type"] with Order
    sed -i '' 's/Schema\["Order"\]\["type"\]/Order/g' "$file"

    # Replace Schema["OrderProduct"]["type"] with OrderProduct
    sed -i '' 's/Schema\["OrderProduct"\]\["type"\]/OrderProduct/g' "$file"

    # Replace Schema["Category"]["type"] with Category
    sed -i '' 's/Schema\["Category"\]\["type"\]/Category/g' "$file"

    # Replace Schema["Product"]["type"]["images"] with ProductImage[]
    sed -i '' 's/Schema\["Product"\]\["type"\]\["images"\]/ProductImage[]/g' "$file"

    # Remove Schema import if it's the only import from amplify/data/resource
    sed -i '' '/^import { Schema } from "amplify\/data\/resource";$/d' "$file"
    sed -i '' "/^import { Schema } from 'amplify\/data\/resource';$/d" "$file"

    # If file now uses Product, Order, etc., ensure it imports from @/lib/types
    if grep -q -E "(Product|Order|OrderProduct|Category|ProductImage)" "$file"; then
      # Check if import already exists
      if ! grep -q 'from "@/lib/types"' "$file" && ! grep -q "from '@/lib/types'" "$file"; then
        # Add import after the "use client" directive if it exists, or at the top
        if grep -q '"use client"' "$file"; then
          sed -i '' '/"use client";/a\
import { Product, Order, OrderProduct, Category, ProductImage } from "@/lib/types";
' "$file"
        else
          sed -i '' '1i\
import { Product, Order, OrderProduct, Category, ProductImage } from "@/lib/types";
' "$file"
        fi
      fi
    fi

    echo "✓ Updated: $file"
  fi
done

echo "Done! Backups created with .bak extension"
echo "If everything works, you can remove backups with: find ../app -name '*.bak' -delete"
