int findMax(const std::vector<int>& nums) {
    // Implementation goes here
    int max = INT_MIN;
    for (int num : nums) {
        if (num > max) {
            max = num;
        }
    }
    return max;
}
