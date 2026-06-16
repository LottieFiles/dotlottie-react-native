# dotLottie iOS embed helper.
#
# The iOS player ships `DotLottiePlayer` as a Swift Package `binaryTarget`
# (an xcframework) pulled in through `spm_dependency` in
# dotlottie-react-native.podspec. CocoaPods attaches that SPM product to the
# Pods `dotlottie-react-native` target, not to the app target. The Xcode IDE
# auto-embeds binary targets, but command-line builds (`expo run:ios`,
# `react-native run-ios`, `xcodebuild`) do not. The framework folder gets copied
# into the app bundle without its Mach-O binary, so installation fails with
# "DotLottiePlayer.framework is missing its bundle executable".
#
# This helper adds a build phase to the app target that copies the fully built
# framework from ${BUILT_PRODUCTS_DIR} into the app bundle and signs it.
#
# Usage (Podfile):
#   require File.join(File.dirname(`node --print "require.resolve('@lottiefiles/dotlottie-react-native/package.json')"`), "scripts/dotlottie_embed")
#   ...
#   post_install do |installer|
#     dotlottie_embed_frameworks!(installer)
#   end

DOTLOTTIE_EMBED_PHASE_NAME = '[dotLottie] Embed DotLottiePlayer'.freeze

DOTLOTTIE_EMBED_SCRIPT = <<~SH.freeze
  set -e
  FRAMEWORK="DotLottiePlayer.framework"
  SRC="${BUILT_PRODUCTS_DIR}/${FRAMEWORK}"
  if [ ! -d "${SRC}" ]; then
    echo "warning: ${FRAMEWORK} not found at ${SRC}; skipping dotLottie embed"
    exit 0
  fi
  DEST="${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}"
  mkdir -p "${DEST}"
  rsync -av --delete "${SRC}/" "${DEST}/${FRAMEWORK}/"
  if [ "${CODE_SIGNING_ALLOWED}" = "YES" ] && [ -n "${EXPANDED_CODE_SIGN_IDENTITY:-}" ] && [ "${EXPANDED_CODE_SIGN_IDENTITY}" != "-" ]; then
    codesign --force --sign "${EXPANDED_CODE_SIGN_IDENTITY}" --preserve-metadata=identifier,entitlements,flags "${DEST}/${FRAMEWORK}"
  fi
SH

# Adds the embed build phase to every application target managed by CocoaPods.
def dotlottie_embed_frameworks!(installer)
  installer.aggregate_targets.each do |aggregate_target|
    user_project = aggregate_target.user_project
    next if user_project.nil?

    changed = false
    aggregate_target.user_target_uuids.each do |uuid|
      native_target = user_project.objects_by_uuid[uuid]
      next if native_target.nil?

      changed = true if dotlottie_add_embed_phase(native_target)
    end

    user_project.save if changed
  end
end

# Returns true if a phase was added, false if it already existed.
def dotlottie_add_embed_phase(native_target)
  existing = native_target.shell_script_build_phases.find do |phase|
    phase.name == DOTLOTTIE_EMBED_PHASE_NAME
  end
  return false unless existing.nil?

  phase = native_target.new_shell_script_build_phase(DOTLOTTIE_EMBED_PHASE_NAME)
  phase.shell_path = '/bin/sh'
  phase.shell_script = DOTLOTTIE_EMBED_SCRIPT
  phase.input_paths = ['$(BUILT_PRODUCTS_DIR)/DotLottiePlayer.framework/DotLottiePlayer']
  phase.output_paths = ['$(TARGET_BUILD_DIR)/$(FRAMEWORKS_FOLDER_PATH)/DotLottiePlayer.framework/DotLottiePlayer']
  Pod::UI.puts "[dotLottie] Added '#{DOTLOTTIE_EMBED_PHASE_NAME}' phase to #{native_target.name}" if defined?(Pod::UI)
  true
end
