#!/bin/bash

# 构建项目
echo "Building project..."
npm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
  echo "Build failed!"
  exit 1
fi

echo "Build successful!"

# 查看构建产物
ls -la dist/