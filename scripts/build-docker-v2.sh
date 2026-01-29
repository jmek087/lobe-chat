#!/bin/bash

# LobeChat v2.0.0 Docker Image Build Script
# This script builds a Docker image with Next-Auth authentication enabled

set -e

# Default values
IMAGE_NAME="lobe-chat-database"
IMAGE_TAG="v2.0.0"
USE_CN_MIRROR="true"
ENABLE_NEXT_AUTH="0"
ENABLE_BETTER_AUTH="1"
ENABLE_CLERK_AUTH="0"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --tag)
      IMAGE_TAG="$2"
      shift 2
      ;;
    --name)
      IMAGE_NAME="$2"
      shift 2
      ;;
    --no-cn-mirror)
      USE_CN_MIRROR="false"
      shift
      ;;
    --next-auth)
      ENABLE_NEXT_AUTH="1"
      ENABLE_BETTER_AUTH="0"
      shift
      ;;
    --better-auth)
      ENABLE_NEXT_AUTH="0"
      ENABLE_BETTER_AUTH="1"
      shift
      ;;
    --clerk-auth)
      ENABLE_NEXT_AUTH="0"
      ENABLE_CLERK_AUTH="1"
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --tag TAG              Docker image tag (default: v2.0.0)"
      echo "  --name NAME            Docker image name (default: lobe-chat-database)"
      echo "  --no-cn-mirror         Don't use China mirror for dependencies"
      echo "  --next-auth            Use Next-Auth instead of Better Auth"
      echo "  --better-auth          Use Better Auth (default)"
      echo "  --clerk-auth           Use Clerk Auth instead of Better Auth"
      echo "  -h, --help             Show this help message"
      echo ""
      echo "Example:"
      echo "  $0                                    # Build with default settings (Better Auth)"
      echo "  $0 --tag v2.1.0 --next-auth          # Build v2.1.0 with Next-Auth"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Display build configuration
echo "=================================="
echo "LobeChat Docker Build Configuration"
echo "=================================="
echo "Image Name:       ${IMAGE_NAME}"
echo "Image Tag:        ${IMAGE_TAG}"
echo "Use CN Mirror:    ${USE_CN_MIRROR}"
echo "Next-Auth:        ${ENABLE_NEXT_AUTH}"
echo "Better Auth:      ${ENABLE_BETTER_AUTH}"
echo "Clerk Auth:       ${ENABLE_CLERK_AUTH}"
echo "=================================="
echo ""

# Build the Docker image
echo "Starting Docker build..."
DOCKER_BUILDKIT=1 docker build \
  -t "${IMAGE_NAME}:${IMAGE_TAG}" \
  -f Dockerfile \
  --build-arg USE_CN_MIRROR="${USE_CN_MIRROR}" \
  --build-arg NEXT_PUBLIC_ENABLE_NEXT_AUTH="${ENABLE_NEXT_AUTH}" \
  --build-arg NEXT_PUBLIC_ENABLE_BETTER_AUTH="${ENABLE_BETTER_AUTH}" \
  --build-arg NEXT_PUBLIC_ENABLE_CLERK_AUTH="${ENABLE_CLERK_AUTH}" \
  .

echo ""
echo "=================================="
echo "Build completed successfully!"
echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "=================================="
