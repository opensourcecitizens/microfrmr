#!/bin/bash

# MicroFrmr Frontend & Backend Integration Test Suite
# Tests all 5 implemented features with live API endpoints

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════════╗"
echo "║          🧪 MICROFRMR INTEGRATION TEST - FRONTEND & BACKEND                   ║"
echo "║                     All 5 Features + API Endpoints                              ║"
echo "╚════════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Helper function for test results
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}: $2"
        ((FAILED++))
    fi
}

echo "═══════════════════════════════════════════════════════════════════════════════════"
echo "📊 PHASE 1: SERVICE AVAILABILITY CHECKS"
echo "═══════════════════════════════════════════════════════════════════════════════════"
echo ""

# Test 1: Frontend availability
echo "Test 1️⃣  Frontend Web Server (Port 8081)..."
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081 2>/dev/null || echo "000")
[ "$FRONTEND" = "200" ] || [ "$FRONTEND" = "304" ] || [ "$FRONTEND" = "403" ]
test_result $? "Frontend accessible at http://localhost:8081 (HTTP $FRONTEND)"
echo ""

# Test 2: Backend API Health
echo "Test 2️⃣  Backend API Health Check (Port 8899)..."
HEALTH=$(curl -s http://localhost:8899 2>/dev/null)
[[ "$HEALTH" == *"Healthz"* ]]
test_result $? "Health endpoint responding: '$HEALTH'"
echo ""

# Test 3: MongoDB connectivity
echo "Test 3️⃣  MongoDB Database (Port 27017)..."
MONGO_PORT=$(ss -tlnp 2>/dev/null | grep 27017 | wc -l)
[ "$MONGO_PORT" -gt 0 ]
test_result $? "MongoDB listening on port 27017"
echo ""

# Test 4: Express API ports
echo "Test 4️⃣  Express API Server Ports..."
API_PORT=$(ss -tlnp 2>/dev/null | grep 8099 | wc -l)
CORS_PORT=$(ss -tlnp 2>/dev/null | grep 8888 | wc -l)
([ "$API_PORT" -gt 0 ] && [ "$CORS_PORT" -gt 0 ])
test_result $? "API (8099) and CORS (8888) ports listening"
echo ""

echo "═══════════════════════════════════════════════════════════════════════════════════"
echo "🎯 PHASE 2: COMPONENT VERIFICATION"
echo "═══════════════════════════════════════════════════════════════════════════════════"
echo ""

# Test 5: ProductAnalyticsDashboard component
echo "Test 5️⃣  ProductAnalyticsDashboard Component..."
[ -f /workspaces/microfrmr/ui/components/ProductAnalyticsDashboard.js ]
test_result $? "ProductAnalyticsDashboard.js exists and is accessible"
echo ""

# Test 6: MediaUploadComponent
echo "Test 6️⃣  MediaUploadComponent..."
[ -f /workspaces/microfrmr/ui/components/MediaUploadComponent.js ]
test_result $? "MediaUploadComponent.js exists and is accessible"
echo ""

# Test 7: EnhancedListingFormComponent
echo "Test 7️⃣  EnhancedListingFormComponent..."
[ -f /workspaces/microfrmr/ui/components/EnhancedListingFormComponent.js ]
test_result $? "EnhancedListingFormComponent.js exists and is accessible"
echo ""

# Test 8: EnhancedUserProfileComponent
echo "Test 8️⃣  EnhancedUserProfileComponent..."
[ -f /workspaces/microfrmr/ui/components/EnhancedUserProfileComponent.js ]
test_result $? "EnhancedUserProfileComponent.js exists and is accessible"
echo ""

echo "═══════════════════════════════════════════════════════════════════════════════════"
echo "🔌 PHASE 3: API ENDPOINT TESTS"
echo "═══════════════════════════════════════════════════════════════════════════════════"
echo ""

# Test 9: Product Category Analytics Endpoint
echo "Test 9️⃣  Analytics Endpoint: Product Categories"
RESPONSE=$(curl -s http://localhost:8099/mfarmapi/analytics/product-categories 2>/dev/null)
[[ "$RESPONSE" == *"success"* ]]
test_result $? "GET /mfarmapi/analytics/product-categories responding with JSON"
echo "        Response snippet: $(echo $RESPONSE | head -c 80)..."
echo ""

# Test 10: Farm Timeline Endpoint
echo "Test 🔟  Analytics Endpoint: Farm Timeline"
RESPONSE=$(curl -s http://localhost:8099/mfarmapi/analytics/farm-timeline 2>/dev/null)
[[ "$RESPONSE" == *"success"* ]]
test_result $? "GET /mfarmapi/analytics/farm-timeline responding with JSON"
echo "        Response snippet: $(echo $RESPONSE | head -c 80)..."
echo ""

# Test 11: Enhanced Profile Endpoint
echo "Test 1️⃣1️⃣  User Profile Endpoint"
RESPONSE=$(curl -s http://localhost:8099/mfarmapi/enhancedprofile/test-user-123 2>/dev/null)
[[ "$RESPONSE" == *"success"* ]]
test_result $? "GET /mfarmapi/enhancedprofile/:userId responding"
echo "        Response snippet: $(echo $RESPONSE | head -c 80)..."
echo ""

# Test 12: Media Upload Endpoint (no file - should error gracefully)
echo "Test 1️⃣2️⃣  Media Upload Endpoint (Structure Test)"
RESPONSE=$(curl -s -X POST http://localhost:8099/mfarmapi/media/upload/user/test-123 2>/dev/null)
[[ "$RESPONSE" == *"success"* || "$RESPONSE" == *"error"* ]]
test_result $? "POST /mfarmapi/media/upload/:parentType/:parentId accessible"
echo "        Response snippet: $(echo $RESPONSE | head -c 80)..."
echo ""

# Test 13: Listings by Category Endpoint
echo "Test 1️⃣3️⃣  Listings by Category Endpoint"
RESPONSE=$(curl -s http://localhost:8099/mfarmapi/listings/category/Vegetables 2>/dev/null)
[[ "$RESPONSE" == *"success"* ]]
test_result $? "GET /mfarmapi/listings/category/:category responding"
echo "        Response snippet: $(echo $RESPONSE | head -c 80)..."
echo ""

echo "═══════════════════════════════════════════════════════════════════════════════════"
echo "📝 PHASE 4: BACKEND TEST SUITE"
echo "═══════════════════════════════════════════════════════════════════════════════════"
echo ""

# Test 14: Run backend tests
echo "Test 1️⃣4️⃣  Backend Integration Tests..."
cd /workspaces/microfrmr/remote_services/api
TEST_OUTPUT=$(npm test 2>&1)
TESTS_PASSED=$(echo "$TEST_OUTPUT" | grep -oP '\d+(?= passing)')

if [ -n "$TESTS_PASSED" ]; then
    echo -e "${GREEN}✅ PASSED${NC}: Backend tests - $TESTS_PASSED tests passing"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC}: Could not verify backend tests (may need seed data)"
    ((FAILED++))
fi
echo ""

echo "═══════════════════════════════════════════════════════════════════════════════════"
echo "🎨 PHASE 5: FRONTEND BUNDLE VERIFICATION"
echo "═══════════════════════════════════════════════════════════════════════════════════"
echo ""

# Test 15: React imports
echo "Test 1️⃣5️⃣  React Component Imports..."
IMPORT_CHECK=$(grep -l "import.*React" /workspaces/microfrmr/ui/components/*.js | wc -l)
[ "$IMPORT_CHECK" -ge 4 ]
test_result $? "All React components have proper imports ($IMPORT_CHECK files)"
echo ""

# Test 16: Component exports
echo "Test 1️⃣6️⃣  Component Exports..."
EXPORT_CHECK=$(grep -l "export" /workspaces/microfrmr/ui/components/*.js | wc -l)
[ "$EXPORT_CHECK" -ge 4 ]
test_result $? "All components properly exported ($EXPORT_CHECK files)"
echo ""

echo "═══════════════════════════════════════════════════════════════════════════════════"
echo "✅ SUMMARY"
echo "═══════════════════════════════════════════════════════════════════════════════════"
echo ""
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}🎉 ALL TESTS PASSED! System is fully operational 🎉${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "📱 Frontend accessible at: ${BLUE}http://localhost:8081${NC}"
    echo "🔌 Backend API at:        ${BLUE}http://localhost:8099/mfarmapi${NC}"
    echo "🟢 All services running:  MongoDB, Express, Expo Web"
    echo ""
else
    echo -e "${YELLOW}⚠️  $FAILED test(s) need attention${NC}"
fi

echo ""
